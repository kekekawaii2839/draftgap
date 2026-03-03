import {
    GetObjectCommand,
    type GetObjectCommandInput,
    PutBucketCorsCommand,
    PutObjectCommand,
    type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
    DATASET_VERSION,
    type Dataset,
} from "@draftgap/core/src/models/dataset/Dataset";
import { bytesToHumanReadable } from "../utils";

// Lazily import S3 client so missing credentials don't crash local-output builds
async function getS3Client() {
    const { client } = await import("./client");
    return client;
}

export async function getDataset({ name }: { name: string }) {
    const client = await getS3Client();
    const params = {
        Bucket: process.env.S3_BUCKET || "draftgap",
        Key: `datasets/v${DATASET_VERSION}/${name}.json`,
    } satisfies GetObjectCommandInput;
    const command = new GetObjectCommand(params);
    const response = await client.send(command);
    const body = await response.Body?.transformToString()!;
    return JSON.parse(body) as Dataset;
}

async function storeDatasetLocally(
    dataset: Dataset,
    { name, tier }: { name: string; tier: string },
) {
    const dir = join(import.meta.dir, "../../output", tier);
    await mkdir(dir, { recursive: true });
    const filePath = join(dir, `${name}.json`);
    const serialized = JSON.stringify(dataset);
    await writeFile(filePath, serialized, "utf-8");
    console.log(
        `Saved dataset locally to ${filePath} (${bytesToHumanReadable(serialized.length)})`,
    );
}

export async function storeDataset(
    dataset: Dataset,
    { name, tier = "emerald_plus" }: { name: string; tier?: string },
) {
    if (!process.env.S3_ACCESS_KEY_ID) {
        return storeDatasetLocally(dataset, { name, tier });
    }
    const client = await getS3Client();
    const params = {
        Bucket: process.env.S3_BUCKET || "draftgap",
        Key: `datasets/v${DATASET_VERSION}/${name}.json`,
        Body: JSON.stringify(dataset),
        ContentType: "application/json",
    } satisfies PutObjectCommandInput;
    const command = new PutObjectCommand(params);
    await client.send(command);

    const serialized = {
        byteLength: params.Body.length,
    };
    console.log(
        `Stored dataset ${params.Bucket}/${
            params.Key
        } of size ${bytesToHumanReadable(serialized.byteLength)}`,
    );

    const corsCommand = new PutBucketCorsCommand({
        Bucket: process.env.S3_BUCKET || "draftgap",
        CORSConfiguration: {
            CORSRules: [
                {
                    AllowedHeaders: ["*"],
                    AllowedMethods: ["GET"],
                    AllowedOrigins: ["*"],
                    MaxAgeSeconds: 3000,
                },
            ],
        },
    });

    await client.send(corsCommand);
}
