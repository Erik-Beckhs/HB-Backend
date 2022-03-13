'use strict';

module.exports = function(Quotation) {

    Quotation.ListadoDeCotizacionesPorProveedor = (idSupplier, cb) => {
        var ds = Quotation.dataSource
        //var sql = "SELECT * FROM PedidoReporte WHERE PedidoID= " + "'" + idSupplier + "'";
        //const estado = 3
        //var sql = `SELECT count(*) count FROM Answer where idSupplier = '${idSupplier}' and state = ${estado};`;
        var sql = `
        select a.idQuotation id, q.name, a.state mystate, concat(ap.name, ' ', ap.last_name) applicant, q.money, q.typeReq, q.auction, q.start, q.end, 
        (CASE 
        WHEN now() < q.start THEN '1'
        WHEN q.start <= now() AND now() < q.end  THEN '2'
        WHEN q.end <= now() THEN '3'
        ELSE 'Desconocido'
        END) statequot
                from Quotation q, Answer a, Applicant ap
                where a.idQuotation = q.id and q.idApplicant = ap.id and a.idSupplier = '${idSupplier}'
                order by end desc 
        `;

        ds.connector.query(sql, (err, instance) => {
            if (err) console.error(err);
            //pubsub.publish('/Pedidoreporte/GET', instance);
            cb(err, instance);
        })
    }
    
    Quotation.remoteMethod(
        'ListadoDeCotizacionesPorProveedor',
        {
            http: { verb: 'get' },
            accepts: [
                { arg: 'idSupplier', type: ['string'] }
            ],
            returns: { arg: 'data', type: ['any'], root: true }
        }
    )

    //lista gral de cotizaciones
    Quotation.ListadoDeCotizaciones = (cb) => {
        var ds = Quotation.dataSource
        //var sql = "SELECT * FROM PedidoReporte WHERE PedidoID= " + "'" + idSupplier + "'";
        //const estado = 3
        //var sql = `SELECT count(*) count FROM Answer where idSupplier = '${idSupplier}' and state = ${estado};`;
        var sql = `
        SELECT q.id, q.name, q.money, q.typeReq, q.start, q.end, concat(a.name, ' ', a.last_name) applicant, 
        a.division, (case when q.end < now() then 'expiró' else 'en curso' end) estado, IFNULL(cant_cot_estado(q.id, 1), 0) aceptados, 
        IFNULL(cant_cot_estado(q.id, 2), 0) rechazados, IFNULL(cant_cot_estado(q.id, 3), 0) en_curso, IFNULL(cant_cot_estado(q.id, 4), 0) total
                FROM Quotation q, Applicant a 
                WHERE q.idApplicant = a.id
                order by q.start desc
        `;

        ds.connector.query(sql, (err, instance) => {
            if (err) console.error(err);
            //pubsub.publish('/Pedidoreporte/GET', instance);
            cb(err, instance);
        })
    }
    
    Quotation.remoteMethod(
        'ListadoDeCotizaciones',
        {
            http: { verb: 'get' },
            accepts: [
            ],
            returns: { arg: 'data', type: ['any'], root: true }
        }
    )
};
