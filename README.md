# Government CSR Portal

A comprehensive platform for Government and CSR partners to manage skilling programmes, track beneficiaries, and generate audit-ready reports.

## Features

### 🏛️ Programme Management
- Create and manage skilling programmes
- Set targets and funding rules
- Track programme performance across districts and sectors
- Support for both Government and CSR programmes

### 👥 Beneficiary Management
- Bulk import beneficiaries via CSV
- Track individual progress and milestones
- Monitor training completion and certification
- Manage placement records and retention

### 📊 Impact Dashboards
- Real-time KPI tracking (Trained, Certified, Placed)
- District-wise performance analysis
- SkillScore uplift monitoring
- Cost analysis and funding tracking

### 🔍 Evidence & Audit
- Generate evidence bundles for compliance
- Proctor logs and attendance records
- Certificate verification links
- Secure, time-limited downloads

### 📤 Export & Reporting
- Multiple export formats (CSV, PDF, NSDC, PMKVY)
- Scheduled exports to SFTP/API
- PII masking and consent management
- Audit-ready report generation

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for data storage
- **JWT** for authentication
- **Multer** for file uploads
- **Joi** for validation
- **Winston** for logging

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gov-csr-portal
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp backend/env.example backend/.env
   
   # Edit backend/.env with your MongoDB URI and other settings
   MONGODB_URI=mongodb://localhost:27017/gov-csr-portal
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Run the application**
   ```bash
   # From root directory
   npm run dev
   
   # Or run separately:
   # Backend (Terminal 1)
   cd backend && npm run dev
   
   # Frontend (Terminal 2)
   cd frontend && npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## API Documentation

### Programme Management
- `POST /api/programmes` - Create programme
- `GET /api/programmes` - List programmes
- `GET /api/programmes/:id` - Get programme details
- `PATCH /api/programmes/:id` - Update programme
- `DELETE /api/programmes/:id` - Delete programme

### Beneficiary Management
- `POST /api/beneficiaries` - Add single beneficiary
- `POST /api/beneficiaries/import/:programmeId` - Bulk import CSV
- `GET /api/beneficiaries/programme/:programmeId` - List beneficiaries
- `PATCH /api/beneficiaries/:id/status` - Update status

### Impact & Analytics
- `GET /api/impact/dashboard/:programmeId` - Get dashboard data
- `GET /api/impact/cost-kpis/:programmeId` - Get cost analysis
- `GET /api/impact/trends/:programmeId` - Get trend data

### Evidence & Exports
- `POST /api/evidence/bundle/:programmeId` - Generate evidence bundle
- `GET /api/evidence/bundle/:bundleId` - Get bundle status
- `POST /api/exports/:programmeId` - Create export job
- `GET /api/exports/:jobId` - Get export status

## Data Models

### Programme
```javascript
{
  _id: String,
  sponsor_type: 'GOV' | 'CSR',
  name: String,
  code: String,
  description: String,
  start_date: Date,
  end_date: Date,
  sectors: [String],
  districts: [String],
  created_by: String,
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
}
```

### Beneficiary
```javascript
{
  _id: String,
  learner_id: String,
  programme_id: String,
  institution_id: String,
  cohort_code: String,
  enrolled_at: Date,
  status: 'ENROLLED' | 'TRAINING' | 'CERTIFIED' | 'PLACED' | 'DROPPED'
}
```

### Progress Record
```javascript
{
  _id: String,
  beneficiary_id: String,
  training_pct: Number,
  last_skillscore: Number,
  milestones: [{
    type: String,
    achieved_at: Date,
    metadata: Object
  }]
}
```

## Features in Detail

### 1. Programme Builder
- Create programmes with targets and funding rules
- Define eligibility criteria and districts
- Track programme lifecycle from draft to completion

### 2. Beneficiary Lifecycle
- Enroll learners into programmes
- Track training progress and assessments
- Monitor certification and placement outcomes
- Generate progress reports

### 3. Impact Analytics
- Real-time dashboard with KPIs
- District-wise performance breakdown
- SkillScore uplift tracking
- Cost analysis and ROI metrics

### 4. Evidence Management
- Generate audit-ready evidence bundles
- Include proctor logs, attendance, and certificates
- Secure, time-limited access
- Compliance with data retention policies

### 5. Export System
- Multiple format support (CSV, PDF, NSDC, PMKVY)
- Scheduled exports to external systems
- PII masking and consent management
- Delivery confirmation and audit trails

## Security & Compliance

### Data Protection
- PII masking in exports by default
- Consent management for data sharing
- Configurable data retention policies
- Audit logging for all sensitive operations

### Access Control
- Role-based access control (RBAC)
- Programme-scoped permissions
- IP allowlisting for exports
- Two-factor authentication support

### Compliance
- DPDP (Digital Personal Data Protection) compliance
- SAR/DCR (Subject Access Request/Data Correction Request) flows
- Audit trail for all data access
- Secure data transmission

## Development

### Project Structure
```
gov-csr-portal/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Validation & auth
│   ├── config/          # Database config
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── public/          # Static assets
└── package.json         # Root package.json
```

### Adding New Features

1. **Backend**: Add new routes in `backend/routes/`
2. **Models**: Create MongoDB schemas in `backend/models/`
3. **Frontend**: Add new pages in `frontend/src/pages/`
4. **API Integration**: Use React Query for data fetching

### Testing
```bash
# Run backend tests
cd backend && npm test

# Run frontend tests (when implemented)
cd frontend && npm test
```

## Deployment

### Production Build
```bash
# Build frontend
cd frontend && npm run build

# Start production server
cd backend && npm start
```

### Environment Variables
```bash
# Production environment
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
PORT=5000
FRONTEND_URL=https://your-domain.com
JWT_SECRET=your-production-secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

### Phase 1 (Current)
- ✅ Programme management
- ✅ Beneficiary tracking
- ✅ Basic dashboards
- ✅ Evidence generation
- ✅ Export system

### Phase 2 (Planned)
- 🔄 Advanced analytics
- 🔄 Mobile app
- 🔄 Real-time notifications
- 🔄 Advanced reporting

### Phase 3 (Future)
- 🔄 AI-powered insights
- 🔄 Integration with external systems
- 🔄 Advanced compliance features
- 🔄 Multi-language support
#   G v t - C s r  
 