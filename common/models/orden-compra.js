'use strict';

module.exports = function(Ordencompra) {
    //id = idSupplier
    Ordencompra.ListadoDeOrdenesdeCompraPorProveedor = (idSupplier, cb) => {
        var ds = Ordencompra.dataSource
      
        var sql = `SELECT oc.id, oc.name, concat(a.name, ' ', a.last_name) solicitante, oc.fecha_orden, oc.importe_total, q.money, q.typeOrigin 
        FROM ordenCompra oc, Quotation q, Applicant a 
        where q.id=oc.id_cotizacion 
        and q.idApplicant = a.id
        and id_proveedor = '${idSupplier}';
        `;

        ds.connector.query(sql, (err, instance) => {
            if (err) console.error(err);
            //pubsub.publish('/Pedidoreporte/GET', instance);
            cb(err, instance);
        })
    }
    
    Ordencompra.remoteMethod(
        'ListadoDeOrdenesdeCompraPorProveedor',
        {
            http: { verb: 'get' },
            accepts: [
                { arg: 'idSupplier', type: ['string'] }
            ],
            returns: { arg: 'data', type: ['any'], root: true }
        }
    )
};
