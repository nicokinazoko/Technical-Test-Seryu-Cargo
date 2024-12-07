# Technical-Test-Seryu-Cargo

Repo for technical test Seryu Cargo

## Description

This project for techincal test on Seryu Cargo

- **Node.js**: v22.11.0 or higher
- **PostgreSQL**: 17.2 or higher

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nicokinazoko/Technical-Test-Seryu-Cargo.git
   ```

2. **Navigate to the project folder:**
   ```bash
   cd Technical-Test-Seryu-Cargo
   ```
3. **Install the required dependencies**
   ```bash
   npm install
   ```
4. **Set up environment variables**

   # Create file _.env-dev_

   ```makefile
   PG_USER=your_db_user
   PG_HOST=your_db_host
   PG_DATABASE=your_db_name
   PG_PASSWORD=your_db_password
   PG_PORT=your_db_port
   ```

5. Import the Database:
   If your database exists in a .rar file containing the SQL schema and sample data, follow these steps:

Extract the .rar file and locate the SQL file.
Use a PostgreSQL client (e.g., psql or a database GUI like DBeaver or pgAdmin) to import the SQL file into your PostgreSQL database.

```bash
psql -U your_db_user -d your_db_name -f path_to_your_sql_file.sql
```

Import the csv file into your database

```bash
psql -U your_db_user -d your_db_name -c "\COPY your_table_name FROM 'path_to_your_file.csv' DELIMITER ',' CSV HEADER"

```

## Running the Project

1. Start the server:

Once the dependencies are installed and the database is set up, you can start the server:

```bash
npm start
```

The server will run on the specified port (default is 3000).

## API Endpoints

### 1. Get Driver Salary List

- **Endpoint**: `GET /salary/driver/list`
- **Description**: Retrieves the list of driver salaries for a specified month and year, with pagination and filtering options.

#### Query Parameters:

- `month` (required): The month for which to fetch the salaries (1-12).
- `year` (required): The year for which to fetch the salaries.
- `page_size` (optional): The number of records per page.
- `current` (optional): The current page number for pagination.
- `driver_code` (optional): A specific driver code to filter the list.
- `status` (optional): Filter by salary status (`PENDING`, `CONFIRMED`, `PAID`).
- `name` (optional): A filter for the driver's name (partially matched).

#### Example Request:

```bash
GET /salary/driver/list?month=12&year=2024&page_size=10&current=1
```

### Response:

- Success (200 OK):

```json
{
  "data": [
    {
      "driver_code": "D001",
      "name": "John Doe",
      "total_pending": 5000,
      "total_confirmed": 3000,
      "total_paid": 1500,
      "total_attendance_salary": 2000,
      "total_salary": 7500,
      "total_shipment": 10
    }
  ],
  "total_row": 100,
  "current": 1,
  "page_size": 10
}
```

- Error (400 Bad Request):

```json
{
  "error": "Filter month is required"
}
```
