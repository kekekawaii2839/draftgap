import { ratingToWinrate } from "@draftgap/core/src/rating/ratings";

type Props = { scalingByTime: number[] };

const W = 80, H = 24, PAD = 2;
const MIN_WR = 0.45, MAX_WR = 0.55;

function toY(rating: number) {
    const wr = Math.max(MIN_WR, Math.min(MAX_WR, ratingToWinrate(rating)));
    return PAD + (1 - (wr - MIN_WR) / (MAX_WR - MIN_WR)) * (H - 2 * PAD);
}

export function ScalingSparkline(props: Props) {
    const points = () =>
        props.scalingByTime
            .map((r, i) => {
                const x = PAD + (i / (props.scalingByTime.length - 1)) * (W - 2 * PAD);
                return `${x},${toY(r)}`;
            })
            .join(" ");

    const midY = toY(0);

    return (
        <svg width={W} height={H}>
            <line
                x1={PAD}
                y1={midY}
                x2={W - PAD}
                y2={midY}
                stroke="#555"
                stroke-width="1"
                stroke-dasharray="2,2"
            />
            <polyline
                points={points()}
                fill="none"
                stroke="#3c82f6"
                stroke-width="2"
                stroke-linejoin="round"
                stroke-linecap="round"
            />
        </svg>
    );
}
