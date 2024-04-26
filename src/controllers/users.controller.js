import { pool } from "../db.js";


export const getUsers = async(req,res)=>{
   try {
     const {rows}=await pool.query("SELECT * from cliente")
     res.json(rows);
   } catch (error) {
    res.status(500).json({message:"Internal Server Error"});
   }
}

export const createUser= async (req, res) => {
    const { id, nombre, edad, correo, direccion } = req.body;
    try {
        const {rows} = await pool.query('INSERT INTO cliente(id, nombre, edad, correo, direccion) VALUES($1, $2, $3, $4, $5) RETURNING *', [id, nombre, edad, correo, direccion]);
        return res.json(rows[0]);
    } catch (error) {
        console.log(error)
        if(error?.code=="23505"){
            return res.status(409).json({message:"email already exists"})
        }
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const getUserById = async (req,res)=>{
    const {id} = req.params
    const {rowCount}=await  pool.query('SELECT * FROM cliente where id=$1',[id])
    res.send('obteniendo  un usuario', + id)
}

export const deleteUser = async (req,res)=>{
    const {id} = req.params
    const {rowCount}=await  pool.query('DELETE FROM cliente where id=$1 RETURNING *',[id])
    if(rowCount==0){
        return res.status(404).json({message:"user not found"})
    }
    return res.sendStatus(204);
}

export const updateUser= async (req,res)=>{
    const {id}=req.params
    const data =req.body;
    const {rows} =await pool.query(
        'UPDATE cliente set nombre=$1,edad=$2,correo=$3,direccion=$4 where id=$5 RETURNING *',[data.nombre,data.edad,data.correo,data.direccion, id])
    return res.json(rows[0]);
}

