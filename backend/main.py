from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy import create_engine, Column, Integer, String, Float, Text
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./marketplace.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemy Model
class ItemDB(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    city = Column(String, index=True)
    category = Column(String, index=True)
    photo_url = Column(String)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Models for API
class ItemCreate(BaseModel):
    title: str
    description: str
    price: float
    city: str
    category: str
    photo_url: str

class ItemResponse(BaseModel):
    id: int
    title: str
    description: str
    price: float
    city: str
    category: str
    photo_url: str

    class Config:
        from_attributes = True

# FastAPI App Setup
app = FastAPI(title="Marketplace API")

# Setup CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from fastapi import HTTPException

@app.delete("/api/items/{item_id}")
def delete_item(item_id: int):
    global items  # o items_db, según el nombre que uses
    for i, item in enumerate(items):
        if item.get("id") == item_id:
            del items[i]
            return {"message": "Item deleted successfully"}
    raise HTTPException(status_code=404, detail="Item not found")
# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Mock Data Generation
def seed_db():
    db = SessionLocal()
    if db.query(ItemDB).first() is None:
        mock_items = [
            {"title": "Laptop Dell XPS 15", "description": "16GB RAM, 512GB SSD. Excellent condition.", "price": 12000.0, "city": "Mexico City", "category": "Electrónicos", "photo_url": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80"},
            {"title": "Sillón de Cuero", "description": "Sillón de 3 plazas, color café.", "price": 4500.0, "city": "Guadalajara", "category": "Muebles", "photo_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80"},
            {"title": "iPhone 13 Pro Max", "description": "256GB, estética 9/10, no incluye cargador.", "price": 15000.0, "city": "Mexico City", "category": "Electrónicos", "photo_url": "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=400&q=80"},
            {"title": "Mesa de Comedor Modernista", "description": "Madera de roble, para 6 personas.", "price": 6000.0, "city": "Mexico City", "category": "Muebles", "photo_url": "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=400&q=80"},
            {"title": "Bicicleta de Montaña Trek", "description": "Rodada 29, frenos de disco.", "price": 8500.0, "city": "Guadalajara", "category": "Deportes", "photo_url": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80"},
            {"title": "Refrigerador Samsung 14 pies", "description": "Con dispensador de agua, 2 años de uso.", "price": 5000.0, "city": "Mexico City", "category": "Electrodomésticos", "photo_url": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=400&q=80"},
            {"title": "Consola PS5 con 2 juegos", "description": "Edición con disco, en caja original.", "price": 9500.0, "city": "Guadalajara", "category": "Electrónicos", "photo_url": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80"},
            {"title": "Escritorio en L para Oficina", "description": "Color negro, muy amplio.", "price": 2200.0, "city": "Mexico City", "category": "Muebles", "photo_url": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80"},
            {"title": "Cámara Canon EOS Rebel T7", "description": "Lente 18-55mm, solo 200 disparos.", "price": 7000.0, "city": "Guadalajara", "category": "Fotografía", "photo_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80"},
            {"title": "Guitarra Acústica Fender", "description": "Incluye funda, cuerdas nuevas.", "price": 3200.0, "city": "Mexico City", "category": "Instrumentos", "photo_url": "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&w=400&q=80"}
        ]
        for item_data in mock_items:
            db_item = ItemDB(**item_data)
            db.add(db_item)
        db.commit()
    db.close()

# Startup Event
@app.on_event("startup")
def on_startup():
    seed_db()

# Routes
@app.get("/api/items", response_model=List[ItemResponse])
def get_items(
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ItemDB)
    if city and city != "Todas":
        query = query.filter(ItemDB.city == city)
    if min_price is not None:
        query = query.filter(ItemDB.price >= min_price)
    if max_price is not None:
        query = query.filter(ItemDB.price <= max_price)
    if category and category != "Todas":
        query = query.filter(ItemDB.category == category)
        
    return query.all()

@app.post("/api/items", response_model=ItemResponse)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = ItemDB(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Marketplace API is running"}
@app.delete("/api/items/{item_id}")
def delete_item(item_id: int):
    for i, item in enumerate(items):
        if item.get("id") == item_id:
            del items[i]
            return {"message": "Item deleted"}
    raise HTTPException(status_code=404, detail="Item not found")
