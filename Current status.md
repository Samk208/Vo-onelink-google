GET / 200 in 11025ms
 ○ Compiling /shop ...
 ✓ Compiled /shop in 4.8s (1385 modules)
 GET /shop 200 in 5101ms
 ○ Compiling /sign-up ...
 ✓ Compiled /sign-up in 3.1s (1566 modules)
 GET /sign-up 200 in 3403ms
 GET /shop 200 in 553ms
 ✓ Compiled in 5.4s (729 modules)
 ✓ Compiled in 2.2s (729 modules)
 ✓ Compiled in 3.9s (1580 modules)
 ✓ Compiled in 3.2s (1580 modules)
 ✓ Compiled in 3.3s (1580 modules)
 ✓ Compiled in 6.3s (1580 modules)
 ✓ Compiled in 5.4s (1580 modules)
 ✓ Compiled in 2.5s (1580 modules)
 ✓ Compiled in 5.2s (1580 modules)
 ✓ Compiled in 3s (1584 modules)
 ✓ Compiled in 2.8s (1584 modules)
 ✓ Compiled in 2.7s (1584 modules)
 ✓ Compiled in 6.3s (1584 modules)
 ✓ Compiled in 2.6s (1584 modules)
 ✓ Compiled in 2.7s (1584 modules)
 ✓ Compiled in 6.3s (1584 modules)
 ✓ Compiled in 4.5s (1584 modules)
 ✓ Compiled in 3.4s (1584 modules)
 ✓ Compiled in 1995ms (1584 modules)
 ✓ Compiled in 7.3s (1584 modules)
 ✓ Compiled in 6.3s (1584 modules)
 ✓ Compiled in 6.3s (1584 modules)
 ✓ Compiled in 6.7s (1584 modules)
 ✓ Compiled in 5.5s (1584 modules)
 ✓ Compiled in 3.1s (1584 modules)
 ✓ Compiled in 2.5s (1584 modules)
 ✓ Compiled in 5.3s (1584 modules)
 ✓ Compiled in 4.9s (1584 modules)
 ✓ Compiled in 4.9s (1584 modules)
 ✓ Compiled in 6.1s (1584 modules)
PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google>
     ^C
PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> npm run dev

> my-v0-project@0.1.0 dev
> next dev

   ▲ Next.js 15.2.4
   - Local:        http://localhost:3000
   - Network:      http://172.30.1.49:3000        
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 5.2s
 ○ Compiling /middleware ...
 ✓ Compiled /middleware in 1530ms (176 modules)
 ○ Compiling / ...
 ✓ Compiled / in 10.9s (1085 modules)
 GET / 200 in 11953ms
 ○ Compiling /sign-up ...
 ✓ Compiled /sign-up in 4s (1298 modules)
 GET /sign-up 200 in 4224ms
 ○ Compiling /shop ...
 ✓ Compiled /shop in 4.3s (1570 modules)
 GET /shop 200 in 4599ms
 ○ Compiling /sign-in ...
 ✓ Compiled /sign-in in 899ms (1577 modules)
 GET /sign-in?redirectTo=%2Fbrands 200 in 1172ms
 GET /sign-in?redirectTo=%2Fbrands 200 in 54ms
 GET /sign-in?redirectTo=%2Finfluencers 200 in 38ms
 ✓ Compiled in 5.8s (909 modules)
 GET /sign-in?redirectTo=%2Finfluencers 200 in 178ms
 GET /sign-in?redirectTo=%2Finfluencers 200 in 269ms
 ✓ Compiled in 6.3s (1767 modules)
 ✓ Compiled in 2.7s (733 modules)
 ✓ Compiled in 3.2s (909 modules)
 ✓ Compiled in 4.9s (1767 modules)
 GET /sign-in?redirectTo=%2Finfluencers 200 in 803ms
 ○ Compiling /influencers ...
 ✓ Compiled /influencers in 1312ms (1580 modules)
 GET /influencers 200 in 1800ms
 ○ Compiling /_not-found ...
 ✓ Compiled /_not-found in 1907ms (1584 modules)
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 GET /_next/static/webpack/2f0c19111fc2433a.webpack.hot-update.json 404 in 2345ms
 GET /influencers 200 in 410ms
 ○ Compiling /brands ...
 ✓ Compiled /brands in 906ms (1588 modules)
 GET /brands 200 in 1110ms
 GET /shop 200 in 69ms
PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google>
 *  History restored 

PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> pnpm build

> my-v0-project@0.1.0 build C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google
> next build

   ▲ Next.js 15.2.4
   - Environments: .env.local

   Creating an optimized production build ...
 ⚠ Compiled with warnings

./app/api/auth/sign-up/route.ts
Attempted import error: 'supabaseAdmin' is not exported from '@/lib/supabase' (imported as 'supabaseAdmin').

Import trace for requested module:
./app/api/auth/sign-up/route.ts

./app/api/auth/sign-up/route.ts
Attempted import error: 'supabaseAdmin' is not exported from '@/lib/supabase' (imported as 'supabaseAdmin').

Import trace for requested module:
./app/api/auth/sign-up/route.ts

./app/api/auth/sign-up/route.ts
Attempted import error: 'supabaseAdmin' is not exported from '@/lib/supabase' (imported as 'supabaseAdmin').

Import trace for requested module:
./app/api/auth/sign-up/route.ts

./app/api/webhooks/stripe/route.ts
Attempted import error: 'supabaseAdmin' is not exported from '@/lib/supabase' (imported as 'supabaseAdmin').

Import trace for requested module:
./app/api/webhooks/stripe/route.ts

./app/api/webhooks/stripe/route.ts
Attempted import error: 'supabaseAdmin' is not exported from '@/lib/supabase' (imported as 'supabaseAdmin').

Import trace for requested module:
./app/api/webhooks/stripe/route.ts

./app/api/webhooks/stripe/route.ts
Attempted import error: 'supabaseAdmin' is not exported from '@/lib/supabase' (imported as 'supabaseAdmin').

Import trace for requested module:
./app/api/webhooks/stripe/route.ts

./app/api/webhooks/stripe/route.ts
Attempted import error: 'supabaseAdmin' is not exported from '@/lib/supabase' (imported as 'supabaseAdmin').

Import trace for requested module:
./app/api/webhooks/stripe/route.ts

./app/api/webhooks/stripe/route.ts
Attempted import error: 'supabaseAdmin' is not exported from '@/lib/supabase' (imported as 'supabaseAdmin').

Import trace for requested module:
./app/api/webhooks/stripe/route.ts

./app/api/webhooks/stripe/route.ts
Attempted import error: 'supabaseAdmin' is not exported from '@/lib/supabase' (imported as 'supabaseAdmin').

Import trace for requested module:
./app/api/webhooks/stripe/route.ts

./app/api/webhooks/stripe/route.ts
Attempted import error: 'supabaseAdmin' is not exported from '@/lib/supabase' (imported as 'supabaseAdmin').

Import trace for requested module:
./app/api/webhooks/stripe/route.ts

./lib/auth-helpers.ts
Attempted import error: 'supabaseAdmin' is not exported from './supabase' (imported as 'supabaseAdmin').

Import trace for requested module:
./lib/auth-helpers.ts
./app/api/checkout/route.ts

./lib/auth-helpers.ts
Attempted import error: 'supabaseAdmin' is not exported from './supabase' (imported as 'supabaseAdmin').

Import trace for requested module:
./lib/auth-helpers.ts
./app/api/checkout/route.ts

./lib/auth-helpers.ts
Attempted import error: 'supabaseAdmin' is not exported from './supabase' (imported as 'supabaseAdmin').

Import trace for requested module:
./lib/auth-helpers.ts
./app/api/checkout/route.ts

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
   Linting and checking validity of types  ...Failed to compile.

./app/(auth)/sign-up/page.tsx:304:45
Type error: Type '{ className: string; }' is not assignable to type 'IntrinsicAttributes'.
  Property 'className' does not exist on type 'IntrinsicAttributes'.

  302 |                                   <div className="flex items-start space-x-4">
  303 |                                     <div className={`p-2 rounded-lg ${isSelected ? "bg-indigo-100" : "bg-gray-100"}`}>        
> 304 |                                       <Icon className={isSelected ? "text-indigo-600" : "text-gray-600"} />
      |                                             ^
  305 |                                     </div>
  306 |                                     <div className="flex-1">
  307 |                                       <div className="flex items-center gap-2 mb-1">
Next.js build worker exited with code: 1 and signal: null
 ELIFECYCLE  Command failed with exit code 1.
PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> free -h  # Linux

pnpm dev    

> my-v0-project@0.1.0 dev C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google
> next dev

   ▲ Next.js 15.2.4
   - Local:        http://localhost:3000
   - Network:      http://192.168.0.3:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 4s
 ○ Compiling /middleware ...
 ✓ Compiled /middleware in 1211ms (176 modules)
 ○ Compiling / ...
 ✓ Compiled / in 7.6s (1085 modules)
 GET / 200 in 8620ms
 ○ Compiling /shop ...
 ✓ Compiled /shop in 3.5s (1389 modules)
 GET /shop 200 in 3715ms
site loads, while product image shows, shop shows zero products


 pnpm typecheck

> my-v0-project@0.1.0 typecheck C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google
> tsc --noEmit

app/(auth)/sign-up/page.tsx:304:45 - error TS2322: Type '{ className: string; }' is not assignable to type 'IntrinsicAttributes'.     
  Property 'className' does not exist on type 'IntrinsicAttributes'.

304                                       <Icon className={isSelected ? "text-indigo-600" : "text-gray-600"} />
                                                ~~~~~~~~~

app/api/auth/sign-up/route.ts:3:10 - error TS2305: Module '"@/lib/supabase"' has no exported member 'supabaseAdmin'.

3 import { supabaseAdmin } from "@/lib/supabase"
           ~~~~~~~~~~~~~

app/api/checkout/route.ts:3:10 - error TS2305: Module '"@/lib/supabase"' has no exported member 'supabaseAdmin'.

3 import { supabaseAdmin } from "@/lib/supabase"
           ~~~~~~~~~~~~~

app/api/debug/database/route.ts:48:8 - error TS2551: Property 'catch' does not exist on type 'PostgrestFilterBuilder<any, any, any, any, "get_table_columns", null, "RPC">'. Did you mean 'match'?       

48       .catch(() => null) // This RPC might not exist, so we catch the error
          ~~~~~

  node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.d.ts:81:5
    81     match<ColumnName extends string & keyof Row>(query: Record<ColumnName, Row[ColumnName]>): this;
           ~~~~~
    'match' is declared here.

app/api/webhooks/stripe/route.ts:3:10 - error TS2305: Module '"@/lib/supabase"' has no exported member 'supabaseAdmin'.

3 import { supabaseAdmin } from "@/lib/supabase"
           ~~~~~~~~~~~~~

lib/auth-helpers.ts:2:10 - error TS2305: Module '"./supabase"' has no exported member 'supabaseAdmin'.

2 import { supabaseAdmin } from './supabase'
           ~~~~~~~~~~~~~

lib/supabase/index.ts:2:44 - error TS2307: Cannot find module './supabase/client' or its corresponding type declarations.

2 export { createClientSupabaseClient } from './supabase/client'   
                                             ~~~~~~~~~~~~~~~~~~~   

lib/supabase/index.ts:3:44 - error TS2307: Cannot find module './supabase/server' or its corresponding type declarations.

3 export { createServerSupabaseClient } from './supabase/server'   
                                             ~~~~~~~~~~~~~~~~~~~   

lib/supabase/index.ts:4:31 - error TS2307: Cannot find module './supabase/admin' or its corresponding type declarations.

4 export { supabaseAdmin } from './supabase/admin'
                                ~~~~~~~~~~~~~~~~~~

lib/supabase/index.ts:7:26 - error TS2307: Cannot find module './supabase' or its corresponding type declarations.

7 export { supabase } from './supabase'
                           ~~~~~~~~~~~~


Found 10 errors in 7 files.

Errors  Files
     1  app/(auth)/sign-up/page.tsx:304
     1  app/api/auth/sign-up/route.ts:3
     1  app/api/checkout/route.ts:3
     1  app/api/debug/database/route.ts:48
     1  app/api/webhooks/stripe/route.ts:3
     1  lib/auth-helpers.ts:2
     4  lib/supabase/index.ts:2
 ELIFECYCLE  Command failed with exit code 2.
PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> 


pnpm lint   

> my-v0-project@0.1.0 lint C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google
> next lint --no-inline-config

✔ No ESLint warnings or errors
PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> 