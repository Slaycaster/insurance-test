# AWS Manual Deployment Guide

Quick reference for deploying Life Insurance Recommendation Engine to AWS via web console.

## Preface

I am more of a CDK deployment guy, if I were to do it, I am going to do CDK deploy using Lambda on backend, RDS, API Gateway on both backend and frontend with CloudFront distribution.

## Architecture Overview

```
CloudFront → S3 (Frontend) + ALB → Elastic Beanstalk (Backend) → RDS PostgreSQL
```

## Prerequisites

- AWS Account with admin access
- Built application (`pnpm run build`)
- Application zip file ready

## Step 1: Create VPC

**AWS Console > VPC > Create VPC**

```
VPC Name: insurance-vpc
CIDR: 10.0.0.0/16
Tenancy: Default
```

**Create Subnets:**

- Public-1: `10.0.1.0/24` (us-east-1a)
- Public-2: `10.0.2.0/24` (us-east-1b)
- Private-1: `10.0.3.0/24` (us-east-1a)
- Private-2: `10.0.4.0/24` (us-east-1b)

**Create Internet Gateway:**

- Name: `insurance-igw`
- Attach to VPC

**Create Route Tables:**

- Public RT: `0.0.0.0/0` → Internet Gateway
- Private RT: (no internet route for now)

## Step 2: Create Security Groups

**EC2 > Security Groups > Create**

**ALB Security Group:**

```
Name: insurance-alb-sg
Inbound: HTTP (80) + HTTPS (443) from 0.0.0.0/0
Outbound: All traffic
```

**App Security Group:**

```
Name: insurance-app-sg
Inbound: HTTP (80) from ALB security group
Outbound: All traffic
```

**Database Security Group:**

```
Name: insurance-db-sg
Inbound: PostgreSQL (5432) from App security group
Outbound: None
```

## Step 3: Create RDS Database

**RDS > Databases > Create Database**

```
Engine: PostgreSQL 15.4
Template: Free tier
Instance: db.t3.micro
DB Name: insurance_db
Username: postgres
Password: Generate and save
VPC: insurance-vpc
Subnet Group: Create new (select private subnets)
Security Group: insurance-db-sg
Initial Database: insurance_db
```

**Save the endpoint URL for later**

## Step 4: Prepare Application Package

**Backend Package Structure:**

```
backend-deploy/
├── app.js (built from TypeScript)
├── package.json
├── node_modules/
└── .ebextensions/
    └── nodecommand.config
```

**Create package.json:**

```json
{
  "name": "insurance-backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

**Create .ebextensions/nodecommand.config:**

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
```

**Zip the entire folder**

## Step 5: Create Elastic Beanstalk Application

**Elastic Beanstalk > Applications > Create Application**

```
Application Name: insurance-recommendation-engine
Platform: Node.js 18
Application Code: Upload zip file
```

**Configure Environment:**

- Environment Name: `insurance-prod`
- Instance Type: `t3.micro`
- VPC: `insurance-vpc`
- Instance Subnets: Private subnets
- Load Balancer Subnets: Public subnets
- Security Groups: `insurance-app-sg`

**Environment Variables:**

```
NODE_ENV=production
PORT=3001
DB_HOST=[RDS_ENDPOINT]
DB_PORT=5432
DB_NAME=insurance_db
DB_USER=postgres
DB_PASSWORD=[YOUR_PASSWORD]
JWT_SECRET=your-production-secret
```

## Step 6: Create S3 Bucket for Frontend

**S3 > Buckets > Create Bucket**

```
Name: insurance-frontend-[random-suffix]
Region: us-east-1
Block Public Access: Disable
Static Website Hosting: Enable
Index: index.html
```

**Upload frontend files from `frontend/out/` folder**

**Bucket Policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## Step 7: Create CloudFront Distribution

**CloudFront > Distributions > Create**

```
Origin Domain: S3 bucket website endpoint
Default Cache Behavior: Redirect HTTP to HTTPS
Default Root Object: index.html
```

**Custom Error Pages:**

- 404 → 200, /index.html (for SPA routing)

## Step 8: Database Migration

**Connect to EB environment via SSH or use RDS Query Editor:**

```sql
-- Run your migration scripts
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendations (
  id SERIAL PRIMARY KEY,
  age INTEGER NOT NULL,
  income DECIMAL(12,2) NOT NULL,
  dependents INTEGER NOT NULL,
  risk_tolerance VARCHAR(10) NOT NULL,
  recommendation_type VARCHAR(255) NOT NULL,
  coverage_amount VARCHAR(255) NOT NULL,
  term_length VARCHAR(255) NOT NULL,
  explanation TEXT NOT NULL,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user
INSERT INTO users (email, password_hash, role)
VALUES ('admin@insurance.com', '$2a$10$hash_here', 'admin');
```

## Step 9: Update Frontend API URL

**Update frontend environment to point to EB URL:**

```javascript
// In your frontend config
const API_URL = "http://your-eb-environment.elasticbeanstalk.com/api";
```

**Rebuild and re-upload to S3**

---
