import {
  Badge,
  Title,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import { constitutions } from './data';

const ConstitutionTable: React.FC = () => (
  <>
    <Title className='mt-16 mb-0'>Ako zložité je zmeniť ústavu? (zelené → jednoduché / červené → ťažké)</Title>
    <div className="overflow-x-auto mt-0">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell></TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
            <TableHeaderCell className="text-right">Dátum prijatia</TableHeaderCell>
            <TableHeaderCell className="text-right">Znenie</TableHeaderCell>
            <TableHeaderCell className="text-right">Novelizácie</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {constitutions.map((item) => (
            <TableRow key={item.krajina}>
              <TableCell className="whitespace-nowrap flex items-center gap-2">
                {item.icon && <item.icon width={24} className="inline-block" />}
                <Badge className='w-32' color={item["zmena vyžaduje badge"]}>{item.krajina}</Badge>
              </TableCell>
              <TableCell>{item["zmena vyžaduje"]}</TableCell>
              <TableCell className="text-right">
                {item["dátum prijatia"].toLocaleDateString('sk-SK')}
              </TableCell>
              <TableCell className="text-right">
                <a
                  href={item.znenie}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  odkaz
                </a>
              </TableCell>
              <TableCell className="text-right">
                <a
                  href={item["zdroj: počet noviel"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Info
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </>
);

export default ConstitutionTable;