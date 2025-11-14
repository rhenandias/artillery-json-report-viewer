import type { ArtilleryData } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableRow } from './ui/table';

interface SummaryViewProps {
  data: ArtilleryData;
}

function SummaryView({ data }: SummaryViewProps) {
  const { aggregate } = data;

  const httpCodes = Object.entries(aggregate.counters)
    .filter(([key]) => key.startsWith('http.codes.'))
    .map(([key, value]) => ({
      code: key.replace('http.codes.', ''),
      count: value,
    }));

  const errors = Object.entries(aggregate.counters)
    .filter(([key]) => key.startsWith('errors.'))
    .map(([key, value]) => ({
      type: key.replace('errors.', ''),
      count: value,
    }));

  const responseTime = aggregate.summaries?.['http.response_time'];
  const responseTime2xx = aggregate.summaries?.['http.response_time.2xx'];
  const responseTime4xx = aggregate.summaries?.['http.response_time.4xx'];
  const sessionLength = aggregate.summaries?.['vusers.session_length'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Counters</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {errors.map((error) => (
                <TableRow key={`errors.${error.type}`}>
                  <TableCell className="font-mono text-sm">
                    errors.{error.type}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {error.count.toLocaleString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
              {httpCodes.map((code) => (
                <TableRow key={`http.codes.${code.code}`}>
                  <TableCell className="font-mono text-sm">
                    http.codes.{code.code}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {code.count.toLocaleString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-mono text-sm">
                  http.downloaded_bytes
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {(
                    aggregate.counters['http.downloaded_bytes'] || 0
                  ).toLocaleString('pt-BR')}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">
                  http.request_rate
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {(aggregate.rates['http.request_rate'] || 0).toFixed(0)}/sec
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">
                  http.requests
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {(aggregate.counters['http.requests'] || 0).toLocaleString(
                    'pt-BR',
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">
                  http.responses
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {(aggregate.counters['http.responses'] || 0).toLocaleString(
                    'pt-BR',
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">
                  vusers.completed
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {(aggregate.counters['vusers.completed'] || 0).toLocaleString(
                    'pt-BR',
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">
                  vusers.created
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {(aggregate.counters['vusers.created'] || 0).toLocaleString(
                    'pt-BR',
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">
                  vusers.failed
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {(aggregate.counters['vusers.failed'] || 0).toLocaleString(
                    'pt-BR',
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {responseTime && (
        <Card>
          <CardHeader>
            <CardTitle>http.response_time</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-sm">min</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime.min}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">max</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime.max}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">mean</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime.mean.toFixed(1)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">median</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime.median}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">p95</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime.p95}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">p99</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime.p99}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {responseTime2xx && (
        <Card>
          <CardHeader>
            <CardTitle>http.response_time.2xx</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-sm">min</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime2xx.min}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">max</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime2xx.max}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">mean</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime2xx.mean.toFixed(1)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">median</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime2xx.median}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">p95</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime2xx.p95}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">p99</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime2xx.p99}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {responseTime4xx && (
        <Card>
          <CardHeader>
            <CardTitle>http.response_time.4xx</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-sm">min</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime4xx.min}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">max</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime4xx.max}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">mean</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime4xx.mean.toFixed(1)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">median</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime4xx.median}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">p95</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime4xx.p95}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">p99</TableCell>
                  <TableCell className="text-right font-semibold">
                    {responseTime4xx.p99}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {sessionLength && (
        <Card>
          <CardHeader>
            <CardTitle>vusers.session_length</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-sm">min</TableCell>
                  <TableCell className="text-right font-semibold">
                    {sessionLength.min}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">max</TableCell>
                  <TableCell className="text-right font-semibold">
                    {sessionLength.max}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">mean</TableCell>
                  <TableCell className="text-right font-semibold">
                    {sessionLength.mean.toFixed(1)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">median</TableCell>
                  <TableCell className="text-right font-semibold">
                    {sessionLength.median}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">p95</TableCell>
                  <TableCell className="text-right font-semibold">
                    {sessionLength.p95}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">p99</TableCell>
                  <TableCell className="text-right font-semibold">
                    {sessionLength.p99}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SummaryView;
