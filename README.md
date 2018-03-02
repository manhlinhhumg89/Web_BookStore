# BookStoreRestApi
#Query lay du lieu cho menu

- SELECT c.id, c.name, 
                (array(
                    SELECT json_build_object('name',c_c.name,'id',c_c.id) 
                    FROM category as c_c WHERE c_c.parent = c.id)
                    ) AS cat_child 
 FROM category as c 
 WHERE parent = 0

 # Query lay du lieu cac loai sach lien quan

 - SELECT name,
            (array(SELECT json_build_object('name',bs.name,'image',bs.images,'id',bs.id_category) FROM book_store as bs 
            JOIN category as c ON c.id= book_store.id_category where category.id = book_store.id_category 
            order by id desc limit 4))as list
  FROM category 
  WHERE category.id = 16
