import React from 'react'

function ReportWorkerTable({data}) {
    const columns = [
        'S.NO','Date','Worker Name','Action','Credit',
        'Debit','Detial'
    ]
  return (
    <div className="col-12 table-responsive">
    <table className="table table-striped">
        <thead>
            <tr>
                {columns?.map((col, i) => (
                    <th key={i} className={`${i===6 ? 'd-none d-md-table-cell':''}`}>{col}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {data.length > 0 ? (
                <>
                    {data[0].reports.map((item, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{item.Date}</td>
                            <td>{item.WorkerName}</td>
                            <td>{item.Action}</td>
                            <td>{item.Credit}</td>
                            <td>{item.Debit}</td>
                            <td>{item.Detail}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={4} className='text-danger'><strong>Total Amount</strong></td>
                        <td><strong className='text-danger'>{data[0].TotalCredit}</strong></td>
                        <td><strong className='text-danger'>{data[0].TotalDebit}</strong></td>
                        <td></td>
                    </tr>
                </>
            ) : (
                <tr>
                    <td colSpan={8}>
                        <h6 className='text-danger text-center'> No Data Found</h6>
                    </td>
                </tr>
            )}
        </tbody>
    </table>
</div>
  )
}

export default ReportWorkerTable