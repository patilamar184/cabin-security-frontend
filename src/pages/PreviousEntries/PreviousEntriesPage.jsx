import { useEffect, useState } from 'react';
import { Fingerprint, RefreshCw, Search } from 'lucide-react';
import { DEPARTMENTS, PAGE_SIZE, ROLES } from '../../config/constants';
import { useAsync } from '../../hooks/useAsync';
import { useDebounce } from '../../hooks/useDebounce';
import * as entryService from '../../services/entryService';
import { formatDate, formatTime24 } from '../../utils/format';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import { FilterSelect } from '../../components/ui/FormFields';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState, ErrorMessage, Loading } from '../../components/ui/Feedback';

const RESULTS = [{ value: 'allowed', label: 'Allowed' }, { value: 'denied', label: 'Denied' }];

export default function PreviousEntriesPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [result, setResult] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  useEffect(() => setPage(1), [debouncedSearch, department, role, result]);

  const { data, loading, error, reload } = useAsync(
    () => entryService.listEntries({ search: debouncedSearch, department, role, result, page, pageSize: PAGE_SIZE }),
    [debouncedSearch, department, role, result, page]
  );

  const clearFilters = () => {
    setSearch(''); setDepartment(''); setRole(''); setResult('');
  };

  return (
    <>
      <PageHeader title="Previous Entries" subtitle="View all past entry records of visitors in your cabin." />

      <div className="card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input className="input" placeholder="Search by name, department or ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <FilterSelect label="Department" value={department} onChange={setDepartment} options={DEPARTMENTS} />
          <FilterSelect label="Role" value={role} onChange={setRole} options={ROLES} />
          <FilterSelect label="Access Result" value={result} onChange={setResult} options={RESULTS} />
          <Button variant="outline" icon={RefreshCw} onClick={clearFilters}>Clear Filters</Button>
        </div>

        {loading && !data ? <Loading /> : error ? <ErrorMessage message={error} onRetry={reload} /> : data.items.length === 0 ? (
          <EmptyState>No entries match these filters. Try clearing them.</EmptyState>
        ) : (
          <>
            <div className="table-wrap" style={{ opacity: loading ? 0.6 : 1 }}>
              <table className="data-table">
                <thead>
                  <tr><th>ID</th><th>Visitor Name</th><th>Department</th><th>Role</th><th>Entry Date</th><th>Entry Time</th><th>Entry Method</th><th>Access Result</th></tr>
                </thead>
                <tbody>
                  {data.items.map((e) => (
                    <tr key={e.id}>
                      <td>{e.id}</td>
                      <td>{e.visitorName}</td>
                      <td>{e.department}</td>
                      <td>{e.role}</td>
                      <td>{formatDate(e.entryAt)}</td>
                      <td>{formatTime24(e.entryAt)}</td>
                      <td><div className="cell-flex"><Fingerprint size={20} className="muted" />{e.method}</div></td>
                      <td><StatusBadge status={e.result} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} onChange={setPage} noun="entries" />
          </>
        )}
      </div>
    </>
  );
}
