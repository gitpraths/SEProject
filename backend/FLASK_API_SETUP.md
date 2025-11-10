# Flask Backend API Setup

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## Requirements

Create `requirements.txt`:

```txt
Flask==3.0.0
Flask-CORS==4.0.0
Flask-SocketIO==5.3.5
python-socketio==5.10.0
flask-jwt-extended==4.5.3
python-dotenv==1.0.0
```

## Basic Flask App Structure

```python
# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')

# CORS configuration
CORS(app, origins=['http://localhost:3000'], supports_credentials=True)

# JWT configuration
jwt = JWTManager(app)

# Socket.IO configuration
socketio = SocketIO(
    app,
    cors_allowed_origins="http://localhost:3000",
    async_mode='threading'
)

# ==========================================
# RESPONSE HELPERS
# ==========================================

def success_response(data=None, message="Success"):
    """Standard success response format"""
    return jsonify({
        "success": True,
        "data": data,
        "message": message
    }), 200

def error_response(message="Error occurred", errors=None, status=400):
    """Standard error response format"""
    response = {
        "success": False,
        "message": message
    }
    if errors:
        response["errors"] = errors
    return jsonify(response), status

def paginated_response(data, page, limit, total):
    """Paginated response format"""
    pages = (total + limit - 1) // limit
    return jsonify({
        "success": True,
        "data": {
            "data": data,
            "page": page,
            "limit": limit,
            "total": total,
            "pages": pages
        }
    }), 200

# ==========================================
# AUTHENTICATION ENDPOINTS
# ==========================================

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # Validate credentials (implement your logic)
        # user = authenticate_user(email, password)
        
        # Create access token
        access_token = create_access_token(identity=email)
        
        return success_response({
            "token": access_token,
            "user": {
                "email": email,
                "name": "John Doe",
                "role": "admin"
            }
        }, "Login successful")
    except Exception as e:
        return error_response(str(e), status=500)

@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['email', 'password', 'name']
        errors = {}
        for field in required_fields:
            if not data.get(field):
                errors[field] = [f"{field} is required"]
        
        if errors:
            return error_response("Validation failed", errors, 422)
        
        # Create user (implement your logic)
        # user = create_user(data)
        
        return success_response({
            "id": 1,
            "email": data['email'],
            "name": data['name']
        }, "Registration successful")
    except Exception as e:
        return error_response(str(e), status=500)

@app.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    """User logout endpoint"""
    return success_response(message="Logout successful")

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user endpoint"""
    current_user = get_jwt_identity()
    return success_response({
        "email": current_user,
        "name": "John Doe",
        "role": "admin"
    })

# ==========================================
# INDIVIDUALS ENDPOINTS
# ==========================================

@app.route('/api/individuals', methods=['GET'])
@jwt_required()
def get_individuals():
    """Get all individuals with pagination"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        search = request.args.get('search', '')
        
        # Fetch individuals from database
        # individuals, total = fetch_individuals(page, limit, search)
        
        # Mock data
        individuals = [
            {"id": 1, "name": "John Doe", "age": 35, "status": "active"},
            {"id": 2, "name": "Jane Smith", "age": 28, "status": "pending"}
        ]
        total = 2
        
        return paginated_response(individuals, page, limit, total)
    except Exception as e:
        return error_response(str(e), status=500)

@app.route('/api/individuals/<int:id>', methods=['GET'])
@jwt_required()
def get_individual(id):
    """Get individual by ID"""
    try:
        # Fetch individual from database
        # individual = fetch_individual_by_id(id)
        
        individual = {"id": id, "name": "John Doe", "age": 35}
        return success_response(individual)
    except Exception as e:
        return error_response(str(e), status=500)

@app.route('/api/individuals', methods=['POST'])
@jwt_required()
def create_individual():
    """Create new individual"""
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['name', 'age']
        errors = {}
        for field in required_fields:
            if not data.get(field):
                errors[field] = [f"{field} is required"]
        
        if errors:
            return error_response("Validation failed", errors, 422)
        
        # Create individual in database
        # individual = create_individual_in_db(data)
        
        individual = {"id": 1, **data}
        
        # Emit socket event
        socketio.emit('new_individual', individual)
        
        return success_response(individual, "Individual created successfully")
    except Exception as e:
        return error_response(str(e), status=500)

@app.route('/api/individuals/<int:id>', methods=['PUT'])
@jwt_required()
def update_individual(id):
    """Update individual"""
    try:
        data = request.get_json()
        
        # Update individual in database
        # individual = update_individual_in_db(id, data)
        
        individual = {"id": id, **data}
        return success_response(individual, "Individual updated successfully")
    except Exception as e:
        return error_response(str(e), status=500)

@app.route('/api/individuals/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_individual(id):
    """Delete individual"""
    try:
        # Delete individual from database
        # delete_individual_from_db(id)
        
        return success_response(message="Individual deleted successfully")
    except Exception as e:
        return error_response(str(e), status=500)

@app.route('/api/individuals/search', methods=['GET'])
@jwt_required()
def search_individuals():
    """Search individuals"""
    try:
        query = request.args.get('q', '')
        
        # Search individuals in database
        # individuals = search_individuals_in_db(query)
        
        individuals = [
            {"id": 1, "name": "John Doe", "age": 35}
        ]
        
        return success_response(individuals)
    except Exception as e:
        return error_response(str(e), status=500)

# ==========================================
# SHELTERS ENDPOINTS
# ==========================================

@app.route('/api/shelters', methods=['GET'])
@jwt_required()
def get_shelters():
    """Get all shelters"""
    try:
        shelters = [
            {"id": 1, "name": "Hope Shelter", "available_beds": 10, "total_capacity": 50},
            {"id": 2, "name": "Safe Haven", "available_beds": 5, "total_capacity": 30}
        ]
        return success_response(shelters)
    except Exception as e:
        return error_response(str(e), status=500)

@app.route('/api/shelters/<int:id>/capacity', methods=['PATCH'])
@jwt_required()
def update_shelter_capacity(id):
    """Update shelter capacity"""
    try:
        data = request.get_json()
        available_beds = data.get('available_beds')
        
        # Update shelter capacity in database
        # shelter = update_shelter_capacity_in_db(id, available_beds)
        
        shelter = {"id": id, "available_beds": available_beds, "total_capacity": 50}
        
        # Emit socket event
        socketio.emit('shelter_update', {
            "shelter_id": id,
            "available_beds": available_beds,
            "total_capacity": 50
        })
        
        return success_response(shelter, "Capacity updated successfully")
    except Exception as e:
        return error_response(str(e), status=500)

# ==========================================
# AI ENDPOINTS
# ==========================================

@app.route('/api/ai/recommend/shelter', methods=['POST'])
@jwt_required()
def recommend_shelter():
    """Get shelter recommendations"""
    try:
        data = request.get_json()
        individual_id = data.get('individual_id')
        
        # Get recommendations from AI model
        # recommendations = get_shelter_recommendations(individual_id)
        
        recommendations = [
            {"shelter_id": 1, "name": "Hope Shelter", "score": 0.95, "distance": 2.5},
            {"shelter_id": 2, "name": "Safe Haven", "score": 0.87, "distance": 3.2}
        ]
        
        return success_response(recommendations)
    except Exception as e:
        return error_response(str(e), status=500)

@app.route('/api/ai/chatbot', methods=['POST'])
@jwt_required()
def chatbot():
    """Chatbot endpoint"""
    try:
        data = request.get_json()
        message = data.get('message')
        conversation_id = data.get('conversation_id')
        
        # Process message with AI
        # response = process_chatbot_message(message, conversation_id)
        
        response = {
            "message": "I understand you need help. How can I assist you today?",
            "conversation_id": conversation_id or "conv_123"
        }
        
        return success_response(response)
    except Exception as e:
        return error_response(str(e), status=500)

# ==========================================
# SOCKET.IO EVENTS
# ==========================================

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('Client connected')
    emit('connection_response', {'status': 'connected'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('Client disconnected')

@socketio.on('join_room')
def handle_join_room(data):
    """Handle room join"""
    room = data.get('room')
    join_room(room)
    emit('room_joined', {'room': room}, room=room)

@socketio.on('leave_room')
def handle_leave_room(data):
    """Handle room leave"""
    room = data.get('room')
    leave_room(room)
    emit('room_left', {'room': room}, room=room)

@socketio.on('send_message')
def handle_message(data):
    """Handle chat message"""
    message = data.get('message')
    room = data.get('room')
    
    emit('chat_message', {
        'message': message,
        'user': 'User',
        'timestamp': 'now'
    }, room=room if room else None)

# ==========================================
# ERROR HANDLERS
# ==========================================

@app.errorhandler(404)
def not_found(error):
    return error_response("Resource not found", status=404)

@app.errorhandler(500)
def internal_error(error):
    return error_response("Internal server error", status=500)

@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return error_response("Missing authorization token", status=401)

@jwt.invalid_token_loader
def invalid_token_callback(callback):
    return error_response("Invalid authorization token", status=401)

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return error_response("Token has expired", status=401)

# ==========================================
# RUN APPLICATION
# ==========================================

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
```

## Environment Variables

Create `.env` file:

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=postgresql://user:password@localhost/dbname
```

## Running the Server

```bash
python app.py
```

Server will run on `http://localhost:5000`

## Testing Endpoints

### Using curl

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get individuals (with token)
curl -X GET http://localhost:5000/api/individuals \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create individual
curl -X POST http://localhost:5000/api/individuals \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","age":35}'
```

### Using Postman

1. Import the API collection
2. Set Authorization header: `Bearer YOUR_TOKEN`
3. Test all endpoints

## Next Steps

1. Implement database models
2. Add input validation
3. Implement authentication logic
4. Add rate limiting
5. Add logging
6. Add unit tests
7. Deploy to production
