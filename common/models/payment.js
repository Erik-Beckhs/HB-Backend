'use strict';

module.exports = function(Payment) {
    Payment.PayList = (idOC, cb) => {
        var ds = Payment.dataSource
        var sql = ` 
        select p.date, pt.name, p.percent, p.amount, q.money
        from payment p, paymentType pt, ordenCompra oc, Quotation q
        where p.idOC = oc.id and oc.id_cotizacion = q.id and p.idpaymentType = pt.id
        and p.idOC = '${idOC}'
        `;
    
        ds.connector.query(sql, (err, instance) => {
            if (err) console.error(err);
            //pubsub.publish('/Pedidoreporte/GET', instance);
            cb(err, instance);
        })
    }
    
    Payment.remoteMethod(
        'PayList',
        {
            http: { verb: 'get' },
            accepts: [
                { arg: 'idOC', type: ['string'] }
            ],
            returns: { arg: 'data', type: ['any'], root: true }
        }
    )
};


