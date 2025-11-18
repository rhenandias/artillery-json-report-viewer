import { Card, CardDescription, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <Card className="text-center sm:text-left">
      <CardDescription>{title}</CardDescription>
      <CardContent>
        <p className="text-3xl text-white font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default StatCard;
