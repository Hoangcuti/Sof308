import 'dotenv/config';
import express from 'express';
import mssql from 'mssql/msnodesqlv8.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Middleware logging
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Root route
app.get('/', (req, res) => {
    res.send('<h1>🚀 Backend Server is Running!</h1><p>API endpoints: <a href="/products">/products</a>, <a href="/users">/users</a>, <a href="/posts">/posts</a></p>');
});

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=yes;`,
};

async function startServer() {
    try {
        await mssql.connect(config);
        console.log('✅ Connected to SQL Server (Windows Auth)');

        const PORT = process.env.PORT || 3000;
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use.`);
            } else {
                console.error('❌ Server error:', err);
            }
            process.exit(1);
        });
    } catch (err) {
        console.error('❌ Database connection failed: ', err);
        process.exit(1);
    }
}

startServer();

// --- API Endpoints ---

// USERS
app.get('/users', async (req, res) => {
    try {
        const result = await mssql.query('SELECT * FROM Users');
        const users = result.recordset.map(u => ({
            id: u.Id,
            username: u.Username,
            password: u.Password,
            role: u.Role,
            name: u.FullName,
            email: u.Email,
            phone: u.Phone,
            profile: {
                name: u.FullName,
                email: u.Email,
                phone: u.Phone,
                bio: u.Bio,
                gender: u.Gender,
                birthday: u.Birthday
            }
        }));
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/users', async (req, res) => {
    const u = req.body;
    try {
        const pool = await mssql.connect(config);
        await pool.request()
            .input('id', mssql.NVarChar, u.id.toString())
            .input('username', mssql.NVarChar, u.username)
            .input('password', mssql.NVarChar, u.password)
            .input('role', mssql.NVarChar, u.role || 'user')
            .input('name', mssql.NVarChar, u.name)
            .input('email', mssql.NVarChar, u.email)
            .input('phone', mssql.NVarChar, u.phone)
            .query('INSERT INTO Users (Id, Username, Password, Role, FullName, Email, Phone) VALUES (@id, @username, @password, @role, @name, @email, @phone)');
        res.status(201).json(u);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PRODUCTS
app.get('/products', async (req, res) => {
    try {
        const result = await mssql.query('SELECT * FROM Products');
        res.json(result.recordset.map(p => ({
            id: p.Id,
            name: p.Name,
            image: p.Image,
            price: p.Price,
            category: p.Category
        })));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/products', async (req, res) => {
    const p = req.body;
    try {
        const pool = await mssql.connect(config);
        await pool.request()
            .input('id', mssql.NVarChar, p.id.toString())
            .input('name', mssql.NVarChar, p.name)
            .input('image', mssql.NVarChar, p.image)
            .input('price', mssql.NVarChar, p.price)
            .input('category', mssql.NVarChar, p.category)
            .query('INSERT INTO Products (Id, Name, Image, Price, Category) VALUES (@id, @name, @image, @price, @category)');
        res.status(201).json(p);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/products/:id', async (req, res) => {
    const p = req.body;
    try {
        const pool = await mssql.connect(config);
        await pool.request()
            .input('id', mssql.NVarChar, req.params.id)
            .input('name', mssql.NVarChar, p.name)
            .input('image', mssql.NVarChar, p.image)
            .input('price', mssql.NVarChar, p.price)
            .input('category', mssql.NVarChar, p.category)
            .query('UPDATE Products SET Name=@name, Image=@image, Price=@price, Category=@category WHERE Id=@id');
        res.json(p);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const pool = await mssql.connect(config);
        await pool.request()
            .input('id', mssql.NVarChar, req.params.id)
            .query('DELETE FROM Products WHERE Id=@id');
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POSTS
app.get('/posts', async (req, res) => {
    try {
        const result = await mssql.query('SELECT * FROM Posts');
        const commentsResult = await mssql.query('SELECT * FROM Comments');
        const posts = result.recordset.map(p => ({
            id: p.Id,
            title: p.Title,
            content: p.Content,
            author: p.Author,
            date: p.Date,
            image: p.Image,
            status: p.Status,
            comments: commentsResult.recordset.filter(c => c.PostId === p.Id).map(c => ({
                author: c.Author,
                text: c.Text
            }))
        }));
        res.json(posts);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/posts', async (req, res) => {
    const p = req.body;
    try {
        const pool = await mssql.connect(config);
        await pool.request()
            .input('id', mssql.NVarChar, Date.now().toString())
            .input('title', mssql.NVarChar, p.title)
            .input('content', mssql.NVarChar, p.content)
            .input('author', mssql.NVarChar, p.author)
            .input('date', mssql.Date, new Date())
            .input('image', mssql.NVarChar, p.image || '')
            .input('status', mssql.NVarChar, 'pending')
            .query('INSERT INTO Posts (Id, Title, Content, Author, Date, Image, Status) VALUES (@id, @title, @content, @author, @date, @image, @status)');
        res.status(201).json(p);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.patch('/posts/:id', async (req, res) => {
    try {
        const pool = await mssql.connect(config);
        if (req.body.status) {
            await pool.request()
                .input('id', mssql.NVarChar, req.params.id)
                .input('status', mssql.NVarChar, req.body.status)
                .query('UPDATE Posts SET Status=@status WHERE Id=@id');
        }
        res.json(req.body);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/posts/:id', async (req, res) => {
    try {
        const pool = await mssql.connect(config);
        await pool.request()
            .input('id', mssql.NVarChar, req.params.id)
            .query('DELETE FROM Posts WHERE Id=@id');
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// USERS (PATCH for profile)
app.patch('/users/:id', async (req, res) => {
    const u = req.body;
    try {
        const pool = await mssql.connect(config);
        await pool.request()
            .input('id', mssql.NVarChar, req.params.id)
            .input('name', mssql.NVarChar, u.name)
            .input('email', mssql.NVarChar, u.email)
            .input('phone', mssql.NVarChar, u.phone)
            .input('bio', mssql.NVarChar, u.bio || '')
            .input('gender', mssql.NVarChar, u.gender || '')
            .input('birthday', mssql.Date, u.birthday ? new Date(u.birthday) : null)
            .query('UPDATE Users SET FullName=@name, Email=@email, Phone=@phone, Bio=@bio, Gender=@gender, Birthday=@birthday WHERE Id=@id');
        res.json(u);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// End of endpoints

// ORDERS
app.get('/orders', async (req, res) => {
    try {
        const result = await mssql.query('SELECT * FROM Orders ORDER BY OrderDate DESC');
        const itemsResult = await mssql.query('SELECT * FROM OrderItems');
        const orders = result.recordset.map(o => ({
            ...o,
            items: itemsResult.recordset.filter(i => i.OrderId === o.Id)
        }));
        res.json(orders);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/users/:userId/orders', async (req, res) => {
    try {
        const pool = await mssql.connect(config);
        const result = await pool.request()
            .input('userId', mssql.NVarChar, req.params.userId)
            .query('SELECT * FROM Orders WHERE UserId = @userId ORDER BY OrderDate DESC');

        const itemsResult = await mssql.query('SELECT * FROM OrderItems');
        const orders = result.recordset.map(o => ({
            ...o,
            items: itemsResult.recordset.filter(i => i.OrderId === o.Id)
        }));
        res.json(orders);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/orders', async (req, res) => {
    const { order, items } = req.body;
    try {
        const pool = await mssql.connect(config);
        const transaction = new mssql.Transaction(pool);
        await transaction.begin();
        try {
            const request = new mssql.Request(transaction);
            await request
                .input('id', mssql.NVarChar, order.id)
                .input('userId', mssql.NVarChar, order.userId || null)
                .input('fullName', mssql.NVarChar, order.fullName)
                .input('phone', mssql.NVarChar, order.phone)
                .input('email', mssql.NVarChar, order.email)
                .input('address', mssql.NVarChar, order.address || '')
                .input('deliveryMethod', mssql.NVarChar, order.deliveryMethod)
                .input('paymentMethod', mssql.NVarChar, order.paymentMethod)
                .input('total', mssql.NVarChar, order.total)
                .input('pickupCode', mssql.NVarChar, order.pickupCode || '')
                .query('INSERT INTO Orders (Id, UserId, FullName, Phone, Email, Address, DeliveryMethod, PaymentMethod, Total, PickupCode) VALUES (@id, @userId, @fullName, @phone, @email, @address, @deliveryMethod, @paymentMethod, @total, @pickupCode)');

            for (const item of items) {
                const itemReq = new mssql.Request(transaction);
                await itemReq
                    .input('orderId', mssql.NVarChar, order.id)
                    .input('productId', mssql.NVarChar, item.id.toString())
                    .input('productName', mssql.NVarChar, item.name)
                    .input('price', mssql.NVarChar, item.price)
                    .input('image', mssql.NVarChar, item.image)
                    .query('INSERT INTO OrderItems (OrderId, ProductId, ProductName, Price, Image) VALUES (@orderId, @productId, @productName, @price, @image)');
            }

            await transaction.commit();
            res.status(201).json({ message: 'Order created successfully' });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.patch('/orders/:id', async (req, res) => {
    try {
        const pool = await mssql.connect(config);
        await pool.request()
            .input('id', mssql.NVarChar, req.params.id)
            .input('status', mssql.NVarChar, req.body.status)
            .query('UPDATE Orders SET Status=@status WHERE Id=@id');
        res.json({ message: 'Order updated' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// End of endpoints
