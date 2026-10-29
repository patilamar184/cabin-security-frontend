import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { DEPARTMENTS, PAGE_SIZE, ROLES, ROUTES } from '../../config/constants';
import { useAsync } from '../../hooks/useAsync';
import { useDebounce } from '../../hooks/useDebounce';
import * as visitorService from '../../services/visitorService';
import { formatDateUS, formatTime12 } from '../../utils/format';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import { FilterSelect } from '../../components/ui/FormFields';
import { FingerprintBadge, RoleBadge } from '../../components/ui/Badge';
import { EmptyState, ErrorMessage, Loading } from '../../components/ui/Feedback';
import RowMenu from '../../components/common/RowMenu';

export default function VisitorsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  // Go back to page 1 whenever a filter changes.
  useEffect(() => setPage(1), [debouncedSearch, department, role]);

  const { data, loading, error, reload } = useAsync(
    () => visitorService.listVisitors({ search: debouncedSearch, department, role, page, pageSize: PAGE_SIZE }),
    [debouncedSearch, department, role, page]
  );

  return (
    <>
      <PageHeader
        title="Registered Visitors"
        subtitle="View and manage all registered visitors for your cabin."
        actions={<Button icon={Plus} onClick={() => navigate(ROUTES.REGISTRATION)}>Add New Visitor</Button>}
      />

      <div className="card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input className="input" placeholder="Search by name, department or phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <FilterSelect label="Department" value={department} onChange={setDepartment} options={DEPARTMENTS} allLabel="All Departments" />
          <FilterSelect label="Role" value={role} onChange={setRole} options={ROLES} allLabel="All Roles" />
        </div>

        {loading && !data ? <Loading /> : error ? <ErrorMessage message={error} onRetry={reload} /> : data.items.length === 0 ? (
          <EmptyState>No visitors match your search. Clear a filter or add a new visitor.</EmptyState>
        ) : (
          <>
            <div className="table-wrap" style={{ opacity: loading ? 0.6 : 1 }}>
              <table className="data-table">
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Department</th><th>Phone</th><th>Role</th><th>Fingerprint Status</th><th>Registered On</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {data.items.map((v) => (
                    <tr key={v.id}>
                      <td>{v.id}</td>
                      <td>{v.name}</td>
                      <td>{v.department}</td>
                      <td>{v.phone}</td>
                      <td><RoleBadge role={v.role} /></td>
                      <td><FingerprintBadge enrolled={v.fingerprintCount > 0} /></td>
                      <td>{formatDateUS(v.registeredAt)}<div className="cell-sub">{formatTime12(v.registeredAt)}</div></td>
                      <td>
                        <RowMenu items={[
                          { label: 'Edit', icon: Pencil, onClick: () => navigate(`${ROUTES.EDIT_REGISTRATION}/${v.id}`) },
                          { label: 'Delete', icon: Trash2, danger: true, onClick: () => navigate(`${ROUTES.DELETE_REGISTRATION}/${v.id}`) },
                        ]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} onChange={setPage} noun="visitors" />
          </>
        )}
      </div>
    </>
  );
}
