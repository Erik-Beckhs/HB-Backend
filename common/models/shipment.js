'use strict';

module.exports = function(Shipment) {

    //devuelve el listado de embarques, dado el id de la OC
    Shipment.ShipmentList = (idOC, cb) => {
        var ds = Shipment.dataSource
        var sql = ` 
        select s.id, s.name, s.origin, s.destination, s.transitDays, s.modality, s.state, s.creationDate
        from dispatch d, shipment s
        where d.idOC = '${idOC}' and d.idShipment = s.id
        `;
    
        ds.connector.query(sql, (err, instance) => {
            if (err) console.error(err);
            //pubsub.publish('/Pedidoreporte/GET', instance);
            cb(err, instance);
        })
    }
    
    Shipment.remoteMethod(
        'ShipmentList',
        {
            http: { verb: 'get' },
            accepts: [
                { arg: 'idOC', type: ['string'] }
            ],
            returns: { arg: 'data', type: ['any'], root: true }
        }
    )

};


