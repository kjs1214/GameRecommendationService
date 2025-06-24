import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface GenreData {
	name: string;
	value: number;
}

interface Props {
	data?: GenreData[];
}

const COLORS = [
	"#00C49F",
	"#FF8042",
	"#00BFFF",
	"#00A4D3",
	"#FFBB28",
	"#FF6666",
	"#8884d8",
];

const RADIAN = Math.PI / 180;

// 외부 라벨 커스터마이저
const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	outerRadius,
	percent,
	index,
	name,
}: any) => {
	const radius = outerRadius + 20;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill={COLORS[index % COLORS.length]}
			textAnchor={x > cx ? "start" : "end"}
			dominantBaseline="central"
			fontSize={18}
		>
			{`${name} ${Math.round(percent * 100)}%`}
		</text>
	);
};

export default function GenreDonutChart({ data }: Props) {
	const safeData = Array.isArray(data) ? data : [];

	// 상위 6개 + 기타 처리
	const finalData = useMemo(() => {
		if (safeData.length === 0) return [];
		const sorted = [...safeData].sort((a, b) => b.value - a.value);
		const top = sorted.slice(0, 6);
		const etcValue = sorted.slice(6).reduce((acc, g) => acc + g.value, 0);
		return etcValue > 0 ? [...top, { name: "기타", value: etcValue }] : top;
	}, [safeData]);

	if (!finalData.length) {
		return <p className="text-center">차트 데이터가 없습니다.</p>;
	}

	return (
		<ResponsiveContainer width={570} height={500}>
			<PieChart>
				<Pie
					data={finalData}
					dataKey="value"
					cx="50%"
					cy="50%"
					innerRadius={100}
					outerRadius={140}
					paddingAngle={5}
					labelLine={false}
					label={renderCustomizedLabel}
					isAnimationActive={false}
					stroke="none"
				>
					{finalData.map((_, index) => (
						<Cell
							key={`cell-${index}`}
							fill={COLORS[index % COLORS.length]}
							radius={10}
						/>
					))}
				</Pie>
			</PieChart>
		</ResponsiveContainer>
	);
}
