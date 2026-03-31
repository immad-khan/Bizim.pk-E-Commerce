# Bizim.pk - System Architecture & Database Design

## 1. High-Level System Architecture

Bizim.pk is built using a modern, decoupled Headless E-commerce architecture. The separation of the frontend (Next.js) from the backend (.NET Web API) allows for ultimate scalability, better security, and flexibility (e.g., easily building a native Mobile App in the future).

```mermaid
graph TD
    Client[("🌐 Client (Browser / Mobile)")]
    
    subgraph Frontend Tier
    Vercel["▲ Vercel (Next.js React Frontend)"]
    end
    
    subgraph Backend Tier
    AppService["☁️ Azure App Service (.NET 10 Web API)"]
    end
    
    subgraph Data & Storage Tier
    Supabase[("🐘 Supabase (PostgreSQL Database)")]
    Cloudinary["🖼️ Cloudinary (Asset / Image CDN)"]
    end
    
    Client -- "HTTPS (UI rendering & routing)" --> Vercel
    Vercel -- "REST API Calls (JSON)" --> AppService
    AppService -- "Entity Framework Core" --> Supabase
    AppService -- "Image Uploads/Retrievals" --> Cloudinary
    Client -. "Direct CDN Image Loading" .-> Cloudinary
```

### Architecture Components
*   **Frontend (Vercel):** Next.js App Router providing Server-Side Rendering (SSR) for blazing fast SEO, utilizing Tailwind CSS and Shadcn UI components for styling.
*   **Backend API (Azure App Service):** An ASP.NET Core 10 Web API. It acts as the gatekeeper, processing business logic, handling checkout sessions, and safely modifying database records.
*   **Database (Supabase):** Managed PostgreSQL database. Connected to the backend via Entity Framework Core (ORM).
*   **Media Storage (Cloudinary):** A dedicated CDN used to store product images. This prevents massive database bloat and serves images much faster globally.

---

## 2. CI/CD Deployment Flow

The system employs Continuous Integration and Continuous Deployment (CI/CD) to ensure changes are deployed automatically inside safe environments.

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git as GitHub Repository
    participant Vercel as Vercel (Frontend CI/CD)
    participant GHAction as GitHub Actions (Backend builder)
    participant Azure as Azure App Service

    Dev->>Git: Push to `main` branch
    
    par Frontend Deployment
        Git->>Vercel: Webhook triggered
        Vercel->>Vercel: Run `pnpm install` & `pnpm build`
        Vercel-->>Dev: Live on bizim.pk
    and Backend Deployment
        Git->>GHAction: GitHub Action triggered
        GHAction->>GHAction: `dotnet build` & `dotnet publish`
        GHAction->>Azure: Deploy bundle via Azure Auth
        Azure-->>Dev: Live on api.bizim.pk
    end
```

---

## 3. Entity Relationship Diagram (Database Schema)

The PostgreSQL database uses the following relational footprint. The structure maintains data integrity by snapping historical prices inside `OrderItems` rather than relying on live prices that might change. 

```mermaid
erDiagram
    CUSTOMER {
        uuid Id PK
        string FullName
        string Email
        string Phone
        string EmergencyPhone
        string City
        string FullAddress
        string Gender
        datetime CreatedAt
    }

    ORDER {
        uuid Id PK
        string OrderId
        string Status
        datetime PlacedAt
        decimal Subtotal
        decimal Shipping
        decimal Tax
        decimal Total
        string PaymentMethod
        uuid CustomerId FK
    }

    ORDER_ITEM {
        uuid Id PK
        uuid ProductId
        string ProductName
        decimal PriceAtOrderTime
        int Quantity
        uuid OrderId FK
    }

    PRODUCT {
        uuid Id PK
        string ProductId
        string Name
        decimal Price
        decimal OriginalPrice
        double Rating
        int Reviews
        string Image
        string ImagePublicId
        string Badge
        string BadgeColor
        boolean OnSale
        decimal SaleDiscount
        int Quantity
        boolean Status
        int Sales
    }

    CUSTOMER ||--o{ ORDER : "Places (1 to Many)"
    ORDER ||--|{ ORDER_ITEM : "Contains (1 to Many)"
    PRODUCT ||--o{ ORDER_ITEM : "Included in (1 to Many)"
```

### Table Descriptions
*   `Customers`: Contains demographic and contact data. This data is attached to orders.
*   `Orders`: A master record of a checkout instance. Tracks financial sum totals, lifecycle status (Pending, Shipped), and links back to the individual customer.
*   `Order_Items`: The bridge table. When an order is placed, an `OrderItem` is created for every product. Crucially, it locks in `PriceAtOrderTime` so financial records remain accurate even if the store admin changes product prices later.
*   `Products`: The master inventory table. Tracks available stock (`Quantity`), marketing flags (`OnSale`, `Badge`), and links directly to the `Cloudinary` image.