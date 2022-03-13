'use strict';

module.exports = function(Answer) {

    Answer.CantidadCotizacionesGanadas = (idSupplier, cb) => {
        var ds = Answer.dataSource
        //var sql = "SELECT * FROM PedidoReporte WHERE PedidoID= " + "'" + idSupplier + "'";
        const estado = 3
        var sql = `SELECT count(*) count FROM Answer where idSupplier = '${idSupplier}' and state = ${estado};`;
    
        ds.connector.query(sql, (err, instance) => {
            if (err) console.error(err);
            //pubsub.publish('/Pedidoreporte/GET', instance);
            cb(err, instance);
        })
    }
    
    Answer.remoteMethod(
        'CantidadCotizacionesGanadas',
        {
            http: { verb: 'get' },
            accepts: [
                { arg: 'idSupplier', type: ['string'] }
            ],
            returns: { arg: 'data', type: ['any'], root: true }
        }
    )

    //Devuelve el listado de aquellos que rechazaron ademas del comentario de rechazo en terms y conditions
    // dada la oc

    Answer.RejectedSuppliers = (idQuotation, cb) => {
    var ds = Answer.dataSource
    var sql = `
    (select s.id, s.name supplier, a.responseDate response_date, tc.name name_term, 
        IFNULL(at.commentSupplier, 'sin comentario') comment, 'termino no aceptado' reason 
        from Supplier s, Answer a, answerTerms at, termsConditions tc
        where a.idQuotation = '${idQuotation}'
        and a.id = at.idAnswer
        and a.state = 4
        and at.checkSupplier = false
        and a.idSupplier = s.id
        and tc.id = at.idTerm
        )
        UNION
        (select s.id, s.name supplier, a.responseDate response_date, 'no corresponde' name_term, 'no corresponde' comment, 'cotizacion abandonada'reason
        from Supplier s, Answer a
        where a.idQuotation = '${idQuotation}'
        and a.state = 9
        and a.idSupplier = s.id)
    `;

    ds.connector.query(sql, (err, instance) => {
        if (err) console.error(err);
        //pubsub.publish('/Pedidoreporte/GET', instance);
        cb(err, instance);
    })
    }

    Answer.remoteMethod(
        'RejectedSuppliers',
        {
            http: { verb: 'get' },
            accepts: [
                { arg: 'idQuotation', type: ['string'] }
            ],
            returns: { arg: 'data', type: ['any'], root: true }
        }
    )
};

