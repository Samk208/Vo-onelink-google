PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> npm run dev 

> my-v0-project@0.1.0 dev
> next dev

   ▲ Next.js 15.2.4
   - Local:        http://localhost:3000
   - Network:      http://192.168.0.3:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 7.4s
 ○ Compiling /middleware ...
 ✓ Compiled /middleware in 1608ms (171 modules)
 ○ Compiling / ...
 ✓ Compiled / in 10.5s (1075 modules)
 GET / 200 in 12947ms
 ○ Compiling /shop ...
 ✓ Compiled /shop in 4.8s (1304 modules)
 GET /shop 200 in 5243ms
 ○ Compiling /influencers ...
 ✓ Compiled /influencers in 1183ms (1307 modules)
 GET /influencers 200 in 1670ms
 ○ Compiling /brands ...
 ✓ Compiled /brands in 968ms (1311 modules)
 GET /brands 200 in 1293ms

 *  History restored 

PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> pnpm dev    

> my-v0-project@0.1.0 dev C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google
> next dev

   ▲ Next.js 15.2.4

   ▲ Next.js 15.2.4
   - Local:        http://localhost:3000
   - Local:        http://localhost:3000
   - Network:      http://192.168.0.3:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 22.8s
PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> ^C
PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> pnpm build  

> my-v0-project@0.1.0 build C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google
> next build

   ▲ Next.js 15.2.4
   - Environments: .env.local

   Creating an optimized production build ...
<w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (108kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
 ⚠ Compiled with warnings

./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
A Node.js API is used (process.versions at line: 34) which is not supported in the Edge Runtime.
Learn more: https://nextjs.org/docs/api-reference/edge-runtime     

Import trace for requested module:
./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
./node_modules/@supabase/realtime-js/dist/module/index.js
./node_modules/@supabase/supabase-js/dist/module/index.js
./node_modules/@supabase/ssr/dist/module/createServerClient.js     
./node_modules/@supabase/ssr/dist/module/index.js
./lib/supabase/server.ts

./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
A Node.js API is used (process.versions at line: 35) which is not supported in the Edge Runtime.
Learn more: https://nextjs.org/docs/api-reference/edge-runtime     

Import trace for requested module:
./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
./node_modules/@supabase/realtime-js/dist/module/index.js
./node_modules/@supabase/supabase-js/dist/module/index.js
./node_modules/@supabase/ssr/dist/module/createServerClient.js     
./node_modules/@supabase/ssr/dist/module/index.js
./lib/supabase/server.ts

./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
A Node.js API is used (process.versions at line: 36) which is not supported in the Edge Runtime.
Learn more: https://nextjs.org/docs/api-reference/edge-runtime     

Import trace for requested module:
./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
./node_modules/@supabase/realtime-js/dist/module/index.js
./node_modules/@supabase/supabase-js/dist/module/index.js
./node_modules/@supabase/ssr/dist/module/createServerClient.js     
./node_modules/@supabase/ssr/dist/module/index.js
./lib/supabase/server.ts

./node_modules/@supabase/supabase-js/dist/module/index.js
A Node.js API is used (process.version at line: 24) which is not supported in the Edge Runtime.
Learn more: https://nextjs.org/docs/api-reference/edge-runtime     

Import trace for requested module:
./node_modules/@supabase/supabase-js/dist/module/index.js
./node_modules/@supabase/ssr/dist/module/createServerClient.js     
./node_modules/@supabase/ssr/dist/module/index.js
./lib/supabase/server.ts

 ✓ Compiled successfully
   Linting and checking validity of types  .Failed to compile.

./app/api/webhooks/stripe/route.ts:152:10
Type error: No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { count?: "exact" | "planned" | "estimated" | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "commissions", never, "POST">', gave the following error.
    Argument of type '{ order_id: any; supplier_id: any; product_id: any; amount: number; rate: any; status: string; created_at: string; }' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: "exact" | "planned" | "estimated" | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "commissions", never, "POST">', gave the following error.
    Object literal may only specify known properties, and 'order_id' does not exist in type 'never[]'.

  150 |       const { error: supplierCommissionError } = await supabaseAdmin
  151 |         .from('commissions')
> 152 |         .insert({
      |          ^
  153 |           order_id: (order as any)?.id,
  154 |           supplier_id: item.supplierId,
  155 |           product_id: item.productId,
Next.js build worker exited with code: 1 and signal: null
 ELIFECYCLE  Command failed with exit code 1.
PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> 


pnpm typecheck

> my-v0-project@0.1.0 typecheck C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google
> tsc --noEmit

app/api/webhooks/stripe/route.ts:152:10 - error TS2769: No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { count?: "exact" | "planned" | "estimated" | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "commissions", never, "POST">', gave the following error.
    Argument of type '{ order_id: any; supplier_id: any; product_id: any; amount: number; rate: any; status: string; created_at: string; }' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: "exact" | "planned" | "estimated" | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "commissions", never, "POST">', gave the following error.
    Object literal may only specify known properties, and 'order_id' does not exist in type 'never[]'.

152         .insert({
             ~~~~~~


app/api/webhooks/stripe/route.ts:176:14 - error TS2769: No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { count?: "exact" | "planned" | "estimated" | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "commissions", never, "POST">', gave the following error.
    Argument of type '{ order_id: any; influencer_id: any; supplier_id: any; product_id: any; amount: number; rate: number; status: string; created_at: string; }' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: "exact" | "planned" | "estimated" | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "commissions", never, "POST">', gave the following error.
    Object literal may only specify known properties, and 'order_id' does not exist in type 'never[]'.

176             .insert({
                 ~~~~~~


app/api/webhooks/stripe/route.ts:210:30 - error TS2339: Property 'stock_count' does not exist on type 'never'.

210       if (product && product.stock_count <= 0) {
                                 ~~~~~~~~~~~

app/api/webhooks/stripe/route.ts:213:19 - error TS2345: Argument of type '{ in_stock: boolean; updated_at: string; }' is not assignable to parameter of type 'never'.

213           .update({
                      ~
214             in_stock: false,
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
215             updated_at: new Date().toISOString()
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
216           })
    ~~~~~~~~~~~

app/api/webhooks/stripe/route.ts:221:75 - error TS2339: Property 'id' does not exist on type 'never'.

221     console.log('Checkout session processing completed for order:', order.id)
                                                                   
           ~~

app/shop/enhanced-page-fixed.tsx:191:13 - error TS2345: Argument of type '{ id: any; name: any; price: any; quantity: number; image: any; category: any; supplier: any; }' is not assignable to parameter of type 'Omit<CartItem, "quantity"> & { quantity?: number | undefined; }'.
  Type '{ id: any; name: any; price: any; quantity: number; image: any; category: any; supplier: any; }' is missing the following properties from type 'Omit<CartItem, "quantity">': title, supplierId, maxQuantity, supplierName, supplierVerified

191     addItem(cartItem)
                ~~~~~~~~

app/shop/enhanced-page-fixed.tsx:517:8 - error TS2741: Property 'onAddToCart' is missing in type '{ product: any; isOpen: boolean; onClose: () => void; }' but required in type 'QuickViewModalProps'.   

517       <QuickViewModal
           ~~~~~~~~~~~~~~

  components/shop/quick-view-modal.tsx:15:3
    15   onAddToCart: (product: any) => void
         ~~~~~~~~~~~
    'onAddToCart' is declared here.

app/shop/enhanced-page.tsx:317:34 - error TS2304: Cannot find name 'addToCart'.

317                     onAddToCart={addToCart}
                                     ~~~~~~~~~

app/shop/enhanced-page.tsx:467:8 - error TS2741: Property 'onAddToCart' is missing in type '{ product: any; isOpen: boolean; onClose: () => void; }' but required in type 'QuickViewModalProps'.

467       <QuickViewModal
           ~~~~~~~~~~~~~~

  components/shop/quick-view-modal.tsx:15:3
    15   onAddToCart: (product: any) => void
         ~~~~~~~~~~~
    'onAddToCart' is declared here.

lib/auth-helpers.ts:45:8 - error TS2769: No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { count?: "exact" | "planned" | "estimated" | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "users", never, "POST">', gave the following error.
    Argument of type '{ id: string; email: string; name: string; role: UserRole; verified: boolean; created_at: string; updated_at: string; }' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: "exact" | "planned" | "estimated" | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "users", never, "POST">', gave the following error.
    Object literal may only specify known properties, and 'id' does not exist in type 'never[]'.

45       .insert({
          ~~~~~~


lib/auth-helpers.ts:78:15 - error TS2345: Argument of type '{ updated_at: string; name?: string | undefined; verified?: boolean | undefined; avatar?: string | undefined; }' is not assignable to parameter of type 'never'.

78       .update({
                 ~
79         ...updates,
   ~~~~~~~~~~~~~~~~~~~
80         updated_at: new Date().toISOString(),
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
81       })
   ~~~~~~~


Found 11 errors in 4 files.

Errors  Files
     5  app/api/webhooks/stripe/route.ts:152
     2  app/shop/enhanced-page-fixed.tsx:191
     2  app/shop/enhanced-page.tsx:317
     2  lib/auth-helpers.ts:45
 ELIFECYCLE  Command failed with exit code 1.
PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> 

 pnpm lint   

> my-v0-project@0.1.0 lint C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google
> next lint --no-inline-config

✔ No ESLint warnings or errors
PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> 