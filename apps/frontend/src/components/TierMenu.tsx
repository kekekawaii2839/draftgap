import { For } from "solid-js";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./common/DropdownMenu";
import { cn } from "../utils/style";
import { buttonVariants } from "./common/Button";
import { useUser } from "../contexts/UserContext";
import {
    RankTier,
    displayNameByRankTier,
} from "@draftgap/core/src/models/user/Config";

export function TierDropdownMenu() {
    const { config, setConfig } = useUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button
                    class={cn(
                        buttonVariants({ variant: "transparent" }),
                        "px-2 py-2 text-sm uppercase font-medium",
                    )}
                >
                    {displayNameByRankTier[config.rankTier]}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-40">
                <DropdownMenuLabel>Rank Tier</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <For each={RankTier}>
                        {(tier) => (
                            <DropdownMenuItem
                                onSelect={() => setConfig({ rankTier: tier })}
                                class={cn(
                                    config.rankTier === tier && "bg-neutral-700",
                                )}
                            >
                                {displayNameByRankTier[tier]}
                            </DropdownMenuItem>
                        )}
                    </For>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
