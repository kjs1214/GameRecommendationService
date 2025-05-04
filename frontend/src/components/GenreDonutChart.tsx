import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface GenreData {
    name: string;
    value: number;
}

interface Props {
    data: GenreData[];
}

const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57", "#d84a4a"
];

export default function GenreDonutChart({ data }: Props) {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, 6);
    const etcValue = sorted.slice(6).reduce((acc, g) => acc + g.value, 0);
    const finalData = etcValue > 0 ? [...top, { name: "기타", value: etcValue }] : top;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={finalData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                >
                    {finalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
        </ResponsiveContainer>
    );
}
