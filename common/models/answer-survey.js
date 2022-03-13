'use strict';

module.exports = function(Answersurvey) {
    Answersurvey.RespuestasProveedores = (idQuotation, cb) => {
        var ds = Answersurvey.dataSource
        //var sql = "SELECT * FROM PedidoReporte WHERE PedidoID= " + "'" + idSupplier + "'";
        //const estado = 3
        var sql = `select s.name proveedor, qu.name pregunta, group_concat(asu.answer1 separator ', ') respuesta
                from answerSurvey asu, Answer a, Query qu, Supplier s
                where asu.idAnswer = a.id 
                and s.id = a.idSupplier
                and a.state not in (1, 4, 7)
                and a.idQuotation = '${idQuotation}'
                and qu.id = asu.idQuery
                group by s.name, qu.name
                order by s.name, qu.name
        `;
    
        ds.connector.query(sql, (err, instance) => {
            if (err) console.error(err);
            //pubsub.publish('/Pedidoreporte/GET', instance);
            cb(err, instance);
        })
    }
    
    Answersurvey.remoteMethod(
        'RespuestasProveedores',
        {
            http: { verb: 'get' },
            accepts: [
                { arg: 'idQuotation', type: ['string'] }
            ],
            returns: { arg: 'data', type: ['any'], root: true }
        }
    )

    /////////
    Answersurvey.SuppliersListSurvey = (idQuotation, cb) => {
        var ds = Answersurvey.dataSource
        var sql = ` select distinct s.name
		from answerSurvey asu, Answer a, Query qu, Supplier s
		where asu.idAnswer = a.id 
		and s.id = a.idSupplier
		and a.state not in (1, 4, 7)
		and a.idQuotation = '${idQuotation}'
		and qu.id = asu.idQuery
        order by s.name
        `;
    
        ds.connector.query(sql, (err, instance) => {
            if (err) console.error(err);
            //pubsub.publish('/Pedidoreporte/GET', instance);
            cb(err, instance);
        })
    }
    
    Answersurvey.remoteMethod(
        'SuppliersListSurvey',
        {
            http: { verb: 'get' },
            accepts: [
                { arg: 'idQuotation', type: ['string'] }
            ],
            returns: { arg: 'data', type: ['any'], root: true }
        }
    )

        // Devuelve la lista de preguntas dado el id de cotizacion
        Answersurvey.QuerysListSurveyByIdQuot = (idQuotation, cb) => {
            var ds = Answersurvey.dataSource
            var sql = `select qu.id, qu.name pregunta from Quotation q, Survey s, Section sec, Query qu
            where q.idSurvey = s.id and s.id = sec.idSurvey and sec.id = qu.idSection and q.id = '${idQuotation}' 
            order by qu.id
            `;
        
            ds.connector.query(sql, (err, instance) => {
                if (err) console.error(err);
                //pubsub.publish('/Pedidoreporte/GET', instance);
                cb(err, instance);
            })
        }
        
        Answersurvey.remoteMethod(
            'QuerysListSurveyByIdQuot',
            {
                http: { verb: 'get' },
                accepts: [
                    { arg: 'idQuotation', type: ['string'] }
                ],
                returns: { arg: 'data', type: ['any'], root: true }
            }
        )

         // devuelve las respuestas dado el id de una pregunta e id de cotizacion
         Answersurvey.AnswerByIdQuotAndIdQuery = (idQuotation, idQuery, cb) => {
             var ds = Answersurvey.dataSource
             var sql = `
             select s.name proveedor, group_concat(asu.answer1 separator ', ') respuesta
             from answerSurvey asu, Answer a, Query qu, Supplier s
             where asu.idAnswer = a.id 
             and s.id = a.idSupplier
             and a.state not in (1, 4, 7)
             and a.idQuotation = '${idQuotation}'
             and qu.id = asu.idQuery
             and qu.id = '${idQuery}'
             group by s.name
             order by proveedor
             `;
                
             ds.connector.query(sql, (err, instance) => {
                if (err) console.error(err);
                //pubsub.publish('/Pedidoreporte/GET', instance);
                cb(err, instance);
             })
        }
                
        Answersurvey.remoteMethod(
              'AnswerByIdQuotAndIdQuery',
              {
                 http: { verb: 'get' },
                  accepts: [
                      { arg: 'idQuotation', type: ['string'] },
                      { arg: 'idQuery', type: ['string'] }
                  ],
                  returns: { arg: 'data', type: ['any'], root: true }
              }
        )
        
};
