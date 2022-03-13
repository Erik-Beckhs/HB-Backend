'use strict';

module.exports = function(Answerdocs) {
    Answerdocs.answerDocs= (idQuotation, cb) => {
        var ds = Answerdocs.dataSource
        var sql = `
        select  s.name proveedor, d.name documento,  ado.document, ado.nameDoc
        from answerDocs ado, Answer a, Supplier s, docsRequired d
        where a.idSupplier = s.id and a.id = ado.idAnswer and ado.idDoc = d.id
        and a.state not in (1, 4, 7)
        and a.idQuotation = '${idQuotation}'
        order by proveedor, documento
        `;
    
        ds.connector.query(sql, (err, instance) => {
            if (err) console.error(err);
            //pubsub.publish('/Pedidoreporte/GET', instance);
            cb(err, instance);
        })
    }

    Answerdocs.remoteMethod(
        'answerDocs',
        {
            http: { verb: 'get' },
            accepts: [
                { arg: 'idQuotation', type: ['string'] }
            ],
            returns: { arg: 'data', type: ['any'], root: true }
        }
    )
};


