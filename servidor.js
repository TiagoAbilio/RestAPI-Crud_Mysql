const mysql = require('mysql2')
const express = require('express')
const { json } = require('express')
const app = express()
app.use(express.json())


function connect(){

    if(global.connection && global.connection.state != 'disconnected'){
        return global.connection
    }


    const bd = mysql.createConnection({
        user: '',
        host: '',
        password: '',
        database: ''
    })

    global.connection = bd
    console.log('Banco Conectado')
    return global.connection
}

connect()

app.get('/pesquisar/:id',pesquisaID,(req,res)=>{
    console.log(pesquisaID.req)
    if(pesquisaID.req != null){
        res.status(200).json({messagem : pesquisaID.req})
    }else{
        res.status(400).json({messagem : "usuario nao encontrado"})
    }
})

app.post('/inserir',async(req,res)=>{
    const banco  = await connect()
    if(req.body.nome && req.body.idade != null){
        const sql = `INSERT INTO informacoes(nome,idade)VALUES(?,?);`
        const valores = [req.body.nome,req.body.idade]
        const inserido = banco.query(sql,valores,(err,results)=>{
            if(results.insertId != null){
                res.status(200).json({id : results.insertId, user : valores[0], idade : valores[1]})
            }else{
                res.status(404).json({messagem : null})
            }
        })
    }    
})

app.delete('/delete/:id',pesquisaID,async(req,res)=>{
    if(pesquisaID.req != null && pesquisaID.req.id == req.params.id){
        const pesquisar = await connect()
        const dados = pesquisar.query(`DELETE FROM informacoes WHERE id = ${req.params.id}`)
        res.status(200).json({"Usuario Deletado" : pesquisaID.req})
    }else{
        res.status(400).json({messagem : "usuario nao encontrado"})
    }
})

app.get('/todos',async(req,res)=>{
    const pesquisar = await connect()
    const dados = pesquisar.query(
        `SELECT * FROM informacoes`,
        (err,results)=>{
            if(!err){
                res.status(200).json({messagem : results})
            }
        }
    )    
})

app.patch('/atualizar/:id',pesquisaID,async(req,res)=>{
    if(pesquisaID != null){
        if(req.body.nome != null && req.body.idade != null){
            const pesquisa = await connect()
            nome = req.body.nome
            idade = req.body.idade
            id = req.params.id
            const dados = pesquisa.query('UPDATE informacoes SET nome = ?, idade = ? WHERE id = ?',[nome,idade,id,req.params.id],function(error,results){
                if(error){
                    res.status(404).json({messagem : error})
                }else{
                    res.status(200).json({messagem : "Dados Atualizados com Sucesso"})
                    console.log(results)
                }
            })
        }else{
            res.status(404).json({messagem : "dados incompleto"})
        }
    }else{
        res.status(404).json({messagem : "Usuario nao encontrado"})
    }
})

async function pesquisaID(req,res,next){
    if(req.params.id != null){
        const pesquisar = await connect()
        const dados = pesquisar.query(
            `SELECT * FROM informacoes WHERE id = ${req.params.id}`,
            (err,results)=>{
                if(!err){
                    pesquisaID.req = results
                    next()
                }
            }
        )
    }else{
        pesquisaID.req = null;
        next()
    }

    

}

app.listen(3000,()=>console.log("Servidor Rodando"))