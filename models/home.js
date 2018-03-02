const { db, } = require('../pgp');

class home{
    constructor(db){
        this.db = db
    }
    dataMenu(){
        return this.db.any("SELECT c.id, c.name, (array( SELECT json_build_object('name', c_c.name, 'id', c_c.id) FROM category AS c_c WHERE c_c.parent = c.id) ) AS cat_child FROM category as c WHERE parent = 0")
    }
    dataHome(limit , offset){
        return this.db.any("SELECT * FROM book_store ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}",{
            limit:limit,
            offset:offset
        })
    }
    count_dataHome(){
        return this.db.any("SELECT count(*) FROM book_store")
    }
    category(id,limit,offset){
        return this.db.any("SELECT bs.* FROM book_store AS bs JOIN category AS c ON c.id = bs.id_category WHERE c.parent = ${id} LIMIT ${limit} OFFSET ${offset}",
            {
                id:id,
                limit:limit,
                offset:offset
            })
    }
    count_category(id){
        return this.db.any("SELECT count(*) FROM category,book_store WHERE book_store.id_category = category.id AND category.parent = $1",id)
    }
    dataDetail(id){
        return this.db.one("SELECT thanhancac.name as thanhancac,book_store.* FROM book_store INNER JOIN category as thanhancac on book_store.id_category = thanhancac.id WHERE book_store.id =  $1",id)
    }
    rate(id){
            let cat = "SELECT * FROM book_store WHERE id = $1"
            let rate = `SELECT name,
                        (array
                            (SELECT json_build_object('name',bs.name ,'image',bs.images,'id',bs.id) FROM book_store as bs
                                JOIN category as c ON c.id = bs.id_category
                                WHERE category.id = bs.id_category	
                                ORDER BY bs.id DESC LIMIT 4 
                            )) as list
                        FROM category 
                        WHERE category.id = $1`
            return db.task(t => {
                return t.one(cat,id)
                    .then(data => {
                        return t.any(rate,data.id_category)
                    }).catch(err => console.log(err))
                }).then(data =>{
                    return data
                })                    
        }
    sub_category(id,limit,offset){
        return this.db.any("SELECT * FROM category,book_store WHERE book_store.id_category = category.id AND category.id = ${id} LIMIT ${limit} OFFSET ${offset}",{
            id:id,
            limit:limit,
            offset:offset
        })
    }
    count_sub_category(id){
        return this.db.any("SELECT count(*) FROM category,book_store WHERE book_store.id_category = category.id AND category.id = $1",id)
    }
    searchBook(name,limit,offset){
        return this.db.any("SELECT * FROM book_store WHERE name ILIKE $1 LIMIT $2 OFFSET $3 ",["%" + name + "%",limit,offset])
    }
    count_searchBook(name){
        return this.db.any("SELECT count(*) FROM book_store WHERE name ILIKE $1",["%" + name + "%"])
    }
}

module.exports = new home(db)