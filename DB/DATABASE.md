# Database

Hosting of the Database will be done in Docker Containers to isolate the Database and giving attackers less attack-surface. This secures and hardens the Heart of the Project.

## Structure

- company(c_id, c_name, c_address, c_telephone, c_mail)
- image(i_id, i_blob, i_timestamp)
- typeValue(i_id, t_type, t_value)

## Tables

Company

```sql
CREATE TABLE companys (
    cid INT NOT NULL AUTO_INCREMENT,
    cname varchar(255) NOT NULL,
    caddress varchar(255),
    ctelephone varchar(255),
    cmail varchar(255),
    PRIMARY KEY (cid)
); 
```

Image

```sql
CREATE TABLE images (
    iid INT NOT NULL AUTO_INCREMENT,
    iblob LONGBLOB NOT NULL,
    itimestamp INT NOT NULL,
    ilat DOUBLE PRECISION,
    ilong DOUBLE PRECISION,
    PRIMARY KEY (iid)
); 
```

TypeValue

```sql
CREATE TABLE typeValues (
    iid INT NOT NULL,
    ttype varchar(255) NOT NULL,
    tvalue varchar(255) NOT NULL,
    PRIMARY KEY (iid, ttype),
    FOREIGN KEY (iid)
        REFERENCES images(iid)
        ON DELETE CASCADE
);
```
