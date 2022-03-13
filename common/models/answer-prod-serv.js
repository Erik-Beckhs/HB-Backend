'use strict';

module.exports = function(Answerprodserv) {
    Answerprodserv.answerSupplierProducts = (idProdServ, cb) => {
        var ds = Answerprodserv.dataSource
        var sql = `
        select s.name, aps.timeService, p.unit, aps.unitPrice, p.amount, aps.total, p.subtotal, (( aps.total / p.subtotal) * 100) diff, a.validity, aps.advantage, aps.about
        from answerProdServ aps, Answer a, Supplier s, productService p
        where aps.idAnswer = a.id and a.idSupplier = s.id
        and a.state not in (1, 4, 7)
        and aps.idProdServ = p.id
        and p.id = '${idProdServ}'
        `;
    
        ds.connector.query(sql, (err, instance) => {
            if (err) console.error(err);
            //pubsub.publish('/Pedidoreporte/GET', instance);
            cb(err, instance);
        })
    }

    Answerprodserv.remoteMethod(
        'answerSupplierProducts',
        {
            http: { verb: 'get' },
            accepts: [
                { arg: 'idProdServ', type: ['string'] }
            ],
            returns: { arg: 'data', type: ['any'], root: true }
        }
    )

};
