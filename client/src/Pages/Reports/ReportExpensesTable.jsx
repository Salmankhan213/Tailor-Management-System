import React, {useMemo} from 'react'

function ReportExpensesTable({data}) {

    const columns = ['S.NO','Date','Type of Expenses','Amount','Detial',]
        

        function ExpensiveCalculation() {
            const totalAmount = useMemo(() => {
              return data.reduce((sum, item) => sum + item.ExpensesAmount, 0);
            }, [data]);
          
            return totalAmount
          }

    return (
        <>
            <div className="col-12">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            {columns?.map((col, i) => (
                                <th key={i}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            <>
                                {data.map((item, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{item.Date}</td>
                                        <td>{item.TypeExpenses}</td>
                                        <td>{item.ExpensesAmount}</td>
                                        <td>{item.Detail ? item.Detail : 'NO DETAIL'}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={3} className='text-danger'><strong>Total Expenses</strong></td>
                                    <td><strong className='text-danger'>{ExpensiveCalculation()}</strong></td>
                                    <td></td>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <td colSpan={5}>
                                    <h6 className='text-danger text-center'> No Data Found</h6>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ReportExpensesTable;
