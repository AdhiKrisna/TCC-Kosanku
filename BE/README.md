# 📄 Kosanku Rest API

Kosanku is a simple RESTful API designed to connect boarding house (kos) owners with seekers (perantau). The API utilizes geolocation data to help users discover nearby accommodations. Kos owners can register and manage kos data (CRUD) through this service.

---

## **🧭 Getting Started Guide**

To start using the Kosanku API, follow the steps below:

- Set up your backend environment (Node.js + Express).
    
- Configure your database connection and ensure the `KosModel` is synced correctly.
    
- Use an API client like Postman to interact with the endpoints.
    
- (Optional) Add authentication middleware for secure access.
    

> ⚠️ _This version does not require authentication yet._ 
  

---

## 🛠️ Available Endpoints

### 👤 User Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/register` | Register a new user |
| POST | `/login` | User login |
| PUT | `/profile/:id` | Update user profile by ID |

### 🏠 Kos Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/kos` | Get all kos entries |
| GET | `/kos/:id` | Get a single kos by its ID |
| GET | `/kos/user/:user_id` | Get kos entries owned by a user |
| POST | `/kos` | Create a new kos |
| PUT | `/kos/:id` | Update an existing kos |
| DELETE | `/kos/:id` | Delete a kos by its ID |

### 📷 Kos Image Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/kos-images/kos/:kosId` | Get all images for a specific kos |
| POST | `/kos-images/kos/:kosId` | Upload multiple images for a kos (form-data) |
| PUT | `/kos-images/:id` | Update a single kos image (form-data with `image_url`) |
| DELETE | `/kos-images/:id` | Delete a specific kos image by ID |

---

## 🧪 Example Request Body

**For Create Kos** **`POST`** **`/kos`****:**

**Headers:**  
Content-Type: multipart/form-data (for images)

| Key | Type | Value |
| --- | --- | --- |
| kos_name | Text | Kos Mawar |
| kos_address | Text | Jl. Kampus UPN |
| kos_description | Text (Opsional) | Kos nyaman dan strategis |
| kos_rules | Text (Opsional) | Tidak boleh bawa hewan |
| category | Text | Putri |
| link_gmaps | Text | [https://maps.google.com/?q=-7.7,110.4](https://maps.google.com/?q=-7.7,110.4) |
| room_available | Number | 10 |
| max_price | Number | 1500000 |
| min_price | Number | 1000000 |
| owner_kos_id | Number | 1 |
| kos_latitude | Number | \-7.7829 |
| kos_longitude | Number | 110.3671 |
| images | File\[\] | multiple JPG/PNG files |

---

**For Update Kos Data By ID** **`PUT`** **`/kos/:id`****:**

**Headers:**

**Content-Type: application/json**

``` json
{
  "kos_name": "Kos Mawar",
  "kos_address": "Jl. Kampus UPN",
  "kos_description": "Kos nyaman dan strategis",
  "kos_rules": "Tidak boleh bawa hewan",
  "category": "Putri",
  "link_gmaps": "https://maps.google.com/?q=-7.7,110.4",
  "room_available": 10,
  "max_price": 1500000,
  "min_price": 1000000,
  "kos_latitude": -7.7829,
  "kos_longitude": 110.3671
}

 ```

---

**For Create Kos Image By Kos ID** **`POST`** **`/kos-images/kos/:kosId`****:**

**Headers:**  
Content-Type: multipart/form-data (Up to 5 files)

| Key | Type | Value (example) |
| --- | --- | --- |
| image_url | File | upload.jpg (bisa multi file) |

---

**For Update Kos Image By Image ID** **`PUT`** **`/kos-images/:id`**:  
Headers:**  
Content-Type: multipart/form-data (only 1 file)

| Key | Type | Value (example) |
| --- | --- | --- |
| image_url | File | upload-baru.jpg (1 file) |

---

## **✅ Example Success Response**

**For Register** **`POST`** **`/register`**:

``` json
{
  "user_name": "Made Krisna",
  "user_phone": "081234567890",
  "user_email": "krisna@mail.com",
  "user_password": "secure123"
<strong class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; >}</b>

 ```

For Login `POST` `/login`:

``` json
{
  "user_email": "krisna@mail.com",
  "user_password": "secure123"
}

 ```

---

**For Update Kos** **`POST`** **`/kos/`**

``` json
{
    "status": "success",
    "message": "Kos created successfully with images",
    "data": {
        "kos_id": 3,
        "kos_name": "Kos Harum Tes",
        "kos_address": "Jl. Kampus UPN 2",
        "kos_description": "Kos nyaman dan harum dengan fasilitas lengkap, dekat kampus.\n",
        "kos_rules": "Tidak boleh bawa hewan",
        "category": "Putri",
        "link_gmaps": "https://maps.google.com/?q=-7.7,110.4",
        "room_available": "20",
        "max_price": "1500000",
        "min_price": "1000000",
        "owner_kos_id": "1",
        "kos_latitude": "-7.7829",
        "kos_longitude": "110.3671",
        "updatedAt": "2025-05-30T21:00:44.418Z",
        "createdAt": "2025-05-30T21:00:44.418Z"
    }
}

 ```

**For Update Kos** **`PUT`** **`/kos/:id`**:

``` json
{
    "status": "success",
    "message": "Kos updated successfully",
    "data": {
        "kos_id": 2,
        "kos_name": "Kos Mawar",
        "kos_address": "Jl. Kampus UPN",
        "kos_description": "Kos nyaman dan strategis",
        "kos_rules": "Tidak boleh bawa hewan",
        "category": "Putri",
        "link_gmaps": "https://maps.google.com/?q=-7.7,110.4",
        "owner_kos_id": 1,
        "room_available": 10,
        "max_price": 1500000,
        "min_price": 1000000,
        "kos_latitude": -7.7829,
        "kos_longitude": 110.3671,
        "createdAt": "2025-05-30T20:52:32.000Z",
        "updatedAt": "2025-05-30T21:14:12.307Z"
    }
}

 ```

**For Update Profile** **`PUT`** **`/profile/:id`**:

``` json
{
  "user_name": "Krisna Adhi",
  "user_phone": "081298765432",
  "user_email": "krisna.new@mail.com"
}

 ```

For Create Kos Response Data `GET` `/kos`:

``` json
{
    "status": "success",
    "message": "Kos fetched successfully",
    "data": [
        {
            "kos_id": 2,
            "kos_name": "Kos Harum Tes Storage",
            "kos_address": "\tJl. Kampus UPN",
            "kos_description": "Kos nyaman dan harum dengan fasilitas lengkap, dekat kampus.\n",
            "kos_rules": "\tTidak boleh bawa hewan",
            "category": "Putri",
            "link_gmaps": "https://maps.google.com/?q=-7.7,110.4",
            "owner_kos_id": 1,
            "room_available": 20,
            "max_price": 1500000,
            "min_price": 1000000,
            "kos_latitude": -7.7829,
            "kos_longitude": 110.367,
            "createdAt": "2025-05-30T20:52:32.000Z",
            "updatedAt": "2025-05-30T20:52:32.000Z",
            "owner": {
                "user_id": 1,
                "user_name": "Made Krisna"
            }
        },
        {
            "kos_id": 3,
            "kos_name": "Kos Harum Tes Storage",
            "kos_address": "Jl. Kampus UPN 2",
            "kos_description": "Kos nyaman dan harum dengan fasilitas lengkap, dekat kampus.\n",
            "kos_rules": "Tidak boleh bawa hewan",
            "category": "Putri",
            "link_gmaps": "https://maps.google.com/?q=-7.7,110.4",
            "owner_kos_id": 1,
            "room_available": 20,
            "max_price": 1500000,
            "min_price": 1000000,
            "kos_latitude": -7.7829,
            "kos_longitude": 110.367,
            "createdAt": "2025-05-30T21:00:44.000Z",
            "updatedAt": "2025-05-30T21:00:44.000Z",
            "owner": {
                "user_id": 1,
                "user_name": "Made Krisna"
            }
        }
    ]
}

 ```

For Update Kos Response Data `GET` `/kos/:id`:

``` json
{
    "status": "success",
    "message": "Kos fetched successfully",
    "data": {
        "kos_id": 3,
        "kos_name": "Kos Harum Tes Storage",
        "kos_address": "Jl. Kampus UPN 2",
        "kos_description": "Kos nyaman dan harum dengan fasilitas lengkap, dekat kampus.\n",
        "kos_rules": "Tidak boleh bawa hewan",
        "category": "Putri",
        "link_gmaps": "https://maps.google.com/?q=-7.7,110.4",
        "owner_kos_id": 1,
        "room_available": 20,
        "max_price": 1500000,
        "min_price": 1000000,
        "kos_latitude": -7.7829,
        "kos_longitude": 110.367,
        "createdAt": "2025-05-30T21:00:44.000Z",
        "updatedAt": "2025-05-30T21:00:44.000Z",
        "owner": {
            "user_id": 1,
            "user_name": "Made Krisna"
        }
    }
}

 ```

For Create Kos Image By Kos ID `POST` `/kos-images/kos/:kosId`:

``` json
{
    "status": "success",
    "message": "Image created successfully",
    "data": [
        {
            "image_id": 6,
            "kos_id": "2",
            "image_url": "uploads\\c87d0081c0d202f665682ed8cc17e565",
            "updatedAt": "2025-05-26T19:23:08.197Z",
            "createdAt": "2025-05-26T19:23:08.197Z"
        }
    ]
}

 ```

For Update Kos Image By Image ID `PUT` `/kos-images/:id`:

``` json
{
    "status": "success",
    "message": "Image updated successfully",
    "data": {
        "image_id": 4,
        "kos_id": "4",
        "image_url": "uploads\\3358439a2d4611b46fa700dec51f6ef4",
        "createdAt": "2025-05-26T15:40:54.000Z",
        "updatedAt": "2025-05-26T19:20:09.074Z"
    }
}

 ```
