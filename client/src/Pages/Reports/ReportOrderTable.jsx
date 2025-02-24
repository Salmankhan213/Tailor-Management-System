import React from 'react'

function ReportOrderTable({data}) {
    const columns = [
        'S.NO','Date','Customer Name','Order Amount','Advance Amount',
        'Remaining Dues','Order Detail','Delivery Date'
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
                            <td>{item.orderDate}</td>
                            <td>{item.CustomerName}</td>
                            <td>{item.OrderAmount}</td>
                            <td>{item.AdvanceAmount}</td>
                            <td>{item.RemainingDues}</td>
                            <td className='d-none d-lg-block'>{item.typeStitching} {item.stitchingPrice} quantity: {item.quantity} <br />
                              total = {item.OrderAmount}
                            </td>
                            <td>{item.deliveryDate}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={3} className='text-danger'><strong>Total Amount</strong></td>
                        <td><strong className='text-danger'>{data[0].totalOrderAmount}</strong></td>
                        <td><strong className='text-danger'>{data[0].totalAdvanceAmount}</strong></td>
                        <td><strong className='text-danger'>{data[0].totalRemainingDues}</strong></td>
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

export default ReportOrderTable