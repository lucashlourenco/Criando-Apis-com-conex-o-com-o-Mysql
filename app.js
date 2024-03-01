const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

// Configurar conexão com o MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'aluno',
  password: 'ifpecjbg',
  database: 'projetinho',
})

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL: ' + err.message)
  } else {
    console.log('Conectado ao MySQL')
  }
})

// Middleware para lidar com dados codificados no corpo da solicitação

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Rota para lidar com o método POST para inserir um usuário
app.post('/api/usuarios', (req, res) => {
  const { email, senha } = req.body

  // Inserir os dados na tabela 'usuario' no banco de dados usando uma query
  const sql = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)'
  connection.query(sql, [email, senha], (err, result) => {
    if (err) {
      console.error('Erro ao inserir registro: ' + err.message)
      res.status(500).json({ error: 'Erro ao inserir registro' })
    } else {
      console.log('Registro inserido com sucesso!')
      res.status(201).json({ message: 'Registro inserido com sucesso' })
    }
  })
})

// Rota para lidar com o método GET para buscar todos os usuários


app.get('/api/usuarios', (req, res) => {
  const sql = 'SELECT * FROM usuarios'
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar registros: ' + err.message)
      res.status(500).json({ error: 'Erro ao buscar registros' })
    } else {
      res.status(200).json(results)
    }
  })

});

//Iniciar o servidor
app.listen(port, () => {
  console.log('Servidor iniciado na porta 3000')
});

app.put('/api/usuarios/:idusuarios', (req, res) => {
    const { idusuarios } = req.params;
    const { email, senha } = req.body;

    //Atualizar os dados na tabela 'usuarios' no banco de dados usando uma query
    const sql = 'UPDATE usuarios SET email = ?, senha = ? WHERE idusuarios = ?';
    connection.query(sql, [email, senha, idusuarios], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar registro: ' + err.message);
            res.status(500).json({ error: 'Erro ao atualizar registro' });
        } else {
            console.error('Registro atualizado com sucesso!');
            res.status(200).json({ message: 'Registro atualizado com sucesso'});
        }
    });
});

app.delete('/api/usuarios/:idusuarios', (req, res) => {
    const { idusuarios } = req.params;

    // Excluir o registro na tabela 'usuarios' no banco de dados pelo ID
    const sql = 'DELETE FROM usuarios WHERE idusuarios = ?';
    connection.query(sql, [idusuarios], (err, result) => {
        if (err) {
            console.error('Erro ao excluir registro: ' + err.message);
            res.status(500).json({ error: 'Erro ao excluir registro'});
        }   else {
            if (result.affectedRows > 0) {
                console.log('Registro excluído com sucesso!');
                res.status(200).json({ message: 'Registro excluído com sucesso'});
            }   else {
                console.log('Registro não encontrado.');
                res.status(404).json({ message: 'Registro não encontrado'});
            }
        }
    });
});
