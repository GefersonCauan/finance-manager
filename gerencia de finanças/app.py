from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from datetime import datetime
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///finances.db'
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    expenses = db.relationship('Expense', backref='user', lazy=True)
    subscriptions = db.relationship('Subscription', backref='user', lazy=True)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    billing_cycle = db.Column(db.String(20), nullable=False)
    next_payment = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
@login_required
def index():
    expenses = Expense.query.filter_by(user_id=current_user.id).order_by(Expense.date.desc()).all()
    subscriptions = Subscription.query.filter_by(user_id=current_user.id).all()
    total_expenses = sum(expense.amount for expense in expenses)
    total_subscriptions = sum(sub.amount for sub in subscriptions)
    return render_template('index.html', 
                         expenses=expenses, 
                         subscriptions=subscriptions,
                         total_expenses=total_expenses,
                         total_subscriptions=total_subscriptions)

@app.route('/add_expense', methods=['POST'])
@login_required
def add_expense():
    description = request.form.get('description')
    amount = float(request.form.get('amount'))
    category = request.form.get('category')
    
    expense = Expense(description=description, amount=amount, category=category, user_id=current_user.id)
    db.session.add(expense)
    db.session.commit()
    
    flash('Despesa adicionada com sucesso!', 'success')
    return redirect(url_for('index'))

@app.route('/add_subscription', methods=['POST'])
@login_required
def add_subscription():
    name = request.form.get('name')
    amount = float(request.form.get('amount'))
    billing_cycle = request.form.get('billing_cycle')
    next_payment = datetime.strptime(request.form.get('next_payment'), '%Y-%m-%d')
    
    subscription = Subscription(name=name, amount=amount, billing_cycle=billing_cycle,
                              next_payment=next_payment, user_id=current_user.id)
    db.session.add(subscription)
    db.session.commit()
    
    flash('Assinatura adicionada com sucesso!', 'success')
    return redirect(url_for('index'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        
        if user and user.password == password:  # In production, use proper password hashing
            login_user(user)
            return redirect(url_for('index'))
        flash('Credenciais inválidas', 'error')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)