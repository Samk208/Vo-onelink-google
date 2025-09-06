pnpm typecheck                    

> my-v0-project@0.1.0 typecheck C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google       
> tsc --noEmit

app/api/admin/users/[id]/verify/route.ts:21:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

21     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/admin/users/[id]/verify/route.ts:72:15 - error TS2345: Argument of type '{ verified: boolean; updated_at: string; }' is not assignable to parameter of type 'never'.      

72       .update({
                 ~
73         verified,
   ~~~~~~~~~~~~~~~~~
74         updated_at: new Date().toISOString(),
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
75       })
   ~~~~~~~

app/api/admin/users/[id]/verify/route.ts:89:96 - error TS2339: Property 'email' does not exist on type 'never'.

89     console.log(`Admin ${user.email} ${verified ? 'verified' : 'unverified'} user ${targetUser.email}${notes ? ` with notes: ${notes}` : ''}`)
                                                                                         
         ~~~~~

app/api/admin/users/[id]/verify/route.ts:92:27 - error TS2339: Property 'id' does not exist on type 'never'.

92       userId: updatedUser.id,
                             ~~

app/api/admin/users/[id]/verify/route.ts:93:29 - error TS2339: Property 'verified' does not exist on type 'never'.

93       verified: updatedUser.verified,
                               ~~~~~~~~

app/api/admin/users/[id]/verify/route.ts:95:30 - error TS2339: Property 'updated_at' does not exist on type 'never'.

95       updatedAt: updatedUser.updated_at,
                                ~~~~~~~~~~

app/api/admin/users/route.ts:21:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.
  Type '{ Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { id?: string | undefined; ... 6 more ...; updated_at?: string | undefined; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_...' is not assignable to type '"public"'.

21     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/admin/verification/[requestId]/review/route.ts:16:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

16     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/admin/verification/[requestId]/review/route.ts:85:66 - error TS2339: Property 'status' does not exist on type 'never'.

85     if (!['submitted', 'in_review'].includes(verificationRequest.status)) {
                                                                    ~~~~~~

app/api/admin/verification/[requestId]/review/route.ts:89:76 - error TS2339: Property 'status' does not exist on type 'never'.

89           error: `Cannot review request with status: ${verificationRequest.status}`,  
                                                                              ~~~~~~     

app/api/admin/verification/[requestId]/review/route.ts:99:15 - error TS2345: Argument of type '{ status: "verified" | "rejected"; rejection_reason: string | null | undefined; reviewed_at: string; reviewed_by: string; updated_at: string; }' is not assignable to parameter of type 'never'.

 99       .update({
                  ~
100         status,
    ~~~~~~~~~~~~~~~
...
104         updated_at: new Date().toISOString(),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
105       })
    ~~~~~~~

app/api/admin/verification/[requestId]/review/route.ts:122:17 - error TS2345: Argument of type '{ role: any; updated_at: string; }' is not assignable to parameter of type 'never'.

122         .update({
                    ~
123           role: verificationRequest.role,
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
124           updated_at: new Date().toISOString(),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
125         })
    ~~~~~~~~~

app/api/admin/verification/[requestId]/review/route.ts:123:37 - error TS2339: Property 'role' does not exist on type 'never'.

123           role: verificationRequest.role,
                                        ~~~~

app/api/admin/verification/[requestId]/review/route.ts:126:39 - error TS2339: Property 'user_id' does not exist on type 'never'.

126         .eq('id', verificationRequest.user_id)
                                          ~~~~~~~

app/api/admin/verification/[requestId]/review/route.ts:131:84 - error TS2339: Property 'user_id' does not exist on type 'never'.

131         console.warn(`Failed to update profile role for user ${verificationRequest.user_id}`)
                                                                                       ~~~~~~~

app/api/auth/sign-in/route.ts:85:54 - error TS2339: Property 'id' does not exist on type 'never'.

85     console.log('Sign-in successful for user:', user.id)
                                                        ~~

app/api/checkout/route.ts:12:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

12     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/checkout/route.ts:59:44 - error TS2339: Property 'id' does not exist on type 'never'.

59       const product = products.find(p => p.id === item.productId)
                                              ~~

app/api/checkout/route.ts:67:19 - error TS2339: Property 'stock_count' does not exist on type 'never'.

67       if (product.stock_count < item.quantity) {
                     ~~~~~~~~~~~

app/api/checkout/route.ts:69:67 - error TS2339: Property 'title' does not exist on type 'never'.

69           { ok: false, message: `Insufficient stock for ${product.title}` },
                                                                     ~~~~~

app/api/checkout/route.ts:74:33 - error TS2339: Property 'price' does not exist on type 'never'.

74       const itemTotal = product.price * item.quantity
                                   ~~~~~

app/api/checkout/route.ts:81:27 - error TS2339: Property 'title' does not exist on type 'never'.

81             name: product.title,
                             ~~~~~

app/api/checkout/route.ts:82:34 - error TS2339: Property 'description' does not exist on type 'never'.

82             description: product.description,
                                    ~~~~~~~~~~~

app/api/checkout/route.ts:83:29 - error TS2339: Property 'images' does not exist on type 'never'.

83             images: product.images.slice(0, 1), // Stripe allows max 8 images
                               ~~~~~~

app/api/checkout/route.ts:85:54 - error TS2339: Property 'price' does not exist on type 'never'.

85           unit_amount: formatAmountForStripe(product.price),
                                                        ~~~~~

app/api/checkout/route.ts:91:28 - error TS2339: Property 'id' does not exist on type 'never'.

91         productId: product.id,
                              ~~

app/api/checkout/route.ts:92:24 - error TS2339: Property 'title' does not exist on type 'never'.

92         title: product.title,
                          ~~~~~

app/api/checkout/route.ts:93:24 - error TS2339: Property 'price' does not exist on type 'never'.

93         price: product.price,
                          ~~~~~

app/api/checkout/route.ts:95:24 - error TS2339: Property 'images' does not exist on type 'never'.

95         image: product.images[0] || '',
                          ~~~~~~

app/api/checkout/route.ts:96:29 - error TS2339: Property 'supplier_id' does not exist on type 'never'.

96         supplierId: product.supplier_id,
                               ~~~~~~~~~~~

app/api/checkout/route.ts:97:29 - error TS2339: Property 'commission' does not exist on type 'never'.

97         commission: product.commission,
                               ~~~~~~~~~~

app/api/commissions/route.ts:62:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

62     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/commissions/route.ts:218:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

218     const user = await getCurrentUser(supabase)
                                          ~~~~~~~~

app/api/commissions/route.ts:240:47 - error TS2769: No overload matches this call.       
  Overload 1 of 2, '(values: never, options?: { count?: "exact" | "planned" | "estimated" | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "commissions", never, "POST">', gave the following error.
    Argument of type '{ order_id: string; influencer_id: string | undefined; supplier_id: string; product_id: string; amount: number; rate: number; status: "pending" | "paid" | "disputed"; created_at: string; }' is not assignable to parameter of type 'never'.        
  Overload 2 of 2, '(values: never[], options?: { count?: "exact" | "planned" | "estimated" | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "commissions", never, "POST">', gave the following error.
    Argument of type '{ order_id: string; influencer_id: string | undefined; supplier_id: string; product_id: string; amount: number; rate: number; status: "pending" | "paid" | "disputed"; created_at: string; }' is not assignable to parameter of type 'never[]'.      
      Object literal may only specify known properties, and 'order_id' does not exist in type 'never[]'.

240     const { data: commission, error } = await supabase
                                                  ~~~~~~~~
241       .from('commissions')
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
...
250         created_at: new Date().toISOString()
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
251       })
    ~~~~~~~~


app/api/commissions/route.ts:263:78 - error TS2339: Property 'id' does not exist on type 'never'.

263     console.log(`💰 [AUDIT] Admin ${user.id} created commission ${commission.id}`)   
                                                                                 ~~      

app/api/dashboard/supplier/route.ts:51:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

51     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/influencer/shop/[id]/route.ts:23:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

23     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/influencer/shop/[id]/route.ts:59:18 - error TS2339: Property 'influencer_id' does not exist on type 'never'.

59     if (existing.influencer_id !== user.id) {
                    ~~~~~~~~~~~~~

app/api/influencer/shop/[id]/route.ts:74:15 - error TS2345: Argument of type '{ updated_at: string; published?: boolean | undefined; customTitle?: string | undefined; customDescription?: string | undefined; salePrice?: number | undefined; displayOrder?: number | undefined; }' is not assignable to parameter of type 'never'.

74       .update(updateData)
                 ~~~~~~~~~~

app/api/influencer/shop/[id]/route.ts:111:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

111     const user = await getCurrentUser(supabase)
                                          ~~~~~~~~

app/api/influencer/shop/[id]/route.ts:133:18 - error TS2339: Property 'influencer_id' does not exist on type 'never'.

133     if (existing.influencer_id !== user.id) {
                     ~~~~~~~~~~~~~

app/api/influencer/shop/route.ts:53:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

53     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/influencer/shop/route.ts:211:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

211     const user = await getCurrentUser(supabase)
                                          ~~~~~~~~

app/api/influencer/shop/route.ts:261:35 - error TS2339: Property 'display_order' does not exist on type 'never'.

261     const nextOrder = (lastOrder?.display_order || 0) + 1
                                      ~~~~~~~~~~~~~

app/api/influencer/shop/route.ts:264:61 - error TS2769: No overload matches this call.   
  Overload 1 of 2, '(values: never, options?: { count?: "exact" | "planned" | "estimated" | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "influencer_shop_products", never, "POST">', gave the following error.      
    Argument of type '{ influencer_id: string; product_id: string; custom_title: string | undefined; custom_description: string | undefined; sale_price: any; published: boolean; display_order: any; }' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: "exact" | "planned" | "estimated" | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "influencer_shop_products", never, "POST">', gave the following error.
    Argument of type '{ influencer_id: string; product_id: string; custom_title: string | undefined; custom_description: string | undefined; sale_price: any; published: boolean; display_order: any; }' is not assignable to parameter of type 'never[]'.
      Object literal may only specify known properties, and 'influencer_id' does not exist in type 'never[]'.

264     const { data: shopProduct, error: insertError } = await supabase
                                                                ~~~~~~~~
265       .from('influencer_shop_products')
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
...
273         display_order: nextOrder
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
274       })
    ~~~~~~~~


app/api/influencer/shop/route.ts:271:42 - error TS2339: Property 'price' does not exist on type 'never'.

271         sale_price: salePrice || product.price,
                                             ~~~~~

app/api/onboarding/brand/route.ts:12:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

12     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/onboarding/brand/route.ts:52:9 - error TS2769: No overload matches this call.    
  Overload 1 of 2, '(values: never, options?: { onConflict?: string | undefined; ignoreDuplicates?: boolean | undefined; count?: "exact" | "planned" | "estimated" | undefined; } | undefined): PostgrestFilterBuilder<{ ...; }, ... 5 more ..., "POST">', gave the following error.
    Argument of type '{ user_id: string; company_name: string; business_type: string; website: string | undefined; description: string; industry: string; company_size: "1-10" | "11-50" | "51-200" | "201-1000" | "1000+"; business_registration_number: string | undefined; tax_id: string | undefined; updated_at: string; }' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { onConflict?: string | undefined; ignoreDuplicates?: boolean | undefined; count?: "exact" | "planned" | "estimated" | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder<...>', gave the following error.
    Argument of type '{ user_id: string; company_name: string; business_type: string; website: string | undefined; description: string; industry: string; company_size: "1-10" | "11-50" | "51-200" | "201-1000" | "1000+"; business_registration_number: string | undefined; tax_id: string | undefined; updated_at: string; }' is not assignable to parameter of type 'never[]'.
      Type '{ user_id: string; company_name: string; business_type: string; website: string | undefined; description: string; industry: string; company_size: "1-10" | "11-50" | "51-200" | "201-1000" | "1000+"; business_registration_number: string | undefined; tax_id: string | undefined; updated_at: string; }' is missing the following properties from type 'never[]': length, pop, push, concat, and 31 more.

52         brandData,
           ~~~~~~~~~


app/api/onboarding/docs/[id]/route.ts:11:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

11     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/onboarding/docs/route.ts:26:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

26     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/onboarding/docs/route.ts:203:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

203     const user = await getCurrentUser(supabase)
                                          ~~~~~~~~

app/api/onboarding/influencer/route.ts:29:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

29     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/onboarding/influencer/route.ts:56:29 - error TS2769: No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { onConflict?: string | undefined; ignoreDuplicates?: boolean | undefined; count?: "exact" | "planned" | "estimated" | undefined; } | undefined): PostgrestFilterBuilder<{ ...; }, ... 5 more ..., "POST">', gave the following error.
    Argument of type '{ user_id: string; bank_name: string; account_holder_name: string; account_number_encrypted: string; routing_number_encrypted: string | null; swift_code_encrypted: string | null; tax_id_encrypted: string | null; address: { ...; }; updated_at: string; }' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { onConflict?: string | undefined; ignoreDuplicates?: boolean | undefined; count?: "exact" | "planned" | "estimated" | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder<...>', gave the following error.
    Argument of type '{ user_id: string; bank_name: string; account_holder_name: string; account_number_encrypted: string; routing_number_encrypted: string | null; swift_code_encrypted: string | null; tax_id_encrypted: string | null; address: { ...; }; updated_at: string; }' is not assignable to parameter of type 'never[]'.
      Object literal may only specify known properties, and 'user_id' does not exist in type 'never[]'.

 56     const { error } = await supabase
                                ~~~~~~~~
 57       .from('influencer_payouts')
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
...
 67         updated_at: new Date().toISOString()
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 68       })
    ~~~~~~~~


app/api/orders/[id]/route.ts:15:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

15     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/orders/[id]/route.ts:76:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

76     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/orders/[id]/route.ts:111:15 - error TS2345: Argument of type '{ status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"; updated_at: string; }' is not assignable to parameter of type 'never'.

111       .update({
                  ~
112         status,
    ~~~~~~~~~~~~~~~
113         updated_at: new Date().toISOString(),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
114       })
    ~~~~~~~

app/api/orders/route.ts:13:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

13     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/products/[id]/route.ts:70:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

70     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/products/[id]/route.ts:108:60 - error TS2339: Property 'supplier_id' does not exist on type 'never'.

108     if (user.role === UserRole.SUPPLIER && existingProduct.supplier_id !== user.id) {
                                                               ~~~~~~~~~~~

app/api/products/[id]/route.ts:132:62 - error TS2339: Property 'sku' does not exist on type 'never'.

132     if (updateData.sku && updateData.sku !== existingProduct.sku) {
                                                                 ~~~

app/api/products/[id]/route.ts:136:44 - error TS2339: Property 'supplier_id' does not exist on type 'never'.

136         .eq('supplier_id', existingProduct.supplier_id)
                                               ~~~~~~~~~~~

app/api/products/[id]/route.ts:183:15 - error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.

183       .update(finalUpdateData)
                  ~~~~~~~~~~~~~~~

app/api/products/[id]/route.ts:231:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

231     const user = await getCurrentUser(supabase)
                                          ~~~~~~~~

app/api/products/[id]/route.ts:269:60 - error TS2339: Property 'supplier_id' does not exist on type 'never'.

269     if (user.role === UserRole.SUPPLIER && existingProduct.supplier_id !== user.id) {
                                                               ~~~~~~~~~~~

app/api/products/export/route.ts:20:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

20     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/products/import/route.ts:38:39 - error TS2345: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

38     const user = await getCurrentUser(supabase)
                                         ~~~~~~~~

app/api/products/import/route.ts:166:71 - error TS2769: No overload matches this call.   
  Overload 1 of 2, '(values: never, options?: { count?: "exact" | "planned" | "estimated" | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "products", never, "POST">', gave the following error.
    Argument of type 'any[]' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: "exact" | "planned" | "estimated" | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "products", never, "POST">', gave the following error.
    Type 'any' is not assignable to type 'never'.

166           const { data: insertedProduct, error: insertError } = await supabase       
                                                                          ~~~~~~~~       
167             .from('products')
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
168             .insert([productData])
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


app/api/products/route.ts:22:8 - error TS2349: This expression is not callable.
  Each member of the union type '{ <TableName extends string, Table extends never[TableName]>(relation: TableName): PostgrestQueryBuilder<{ PostgrestVersion: "12"; }, never, Table, TableName, Table extends { ...; } ? R : unknown>; <ViewName extends string, View extends never[ViewName]>(relation: ViewName): PostgrestQueryBuilder<...>; } | { ...; }' has signatures, but none of those signatures are compatible with each other.

22       .from('products')
          ~~~~

app/api/shop/[handle]/route.ts:92:39 - error TS2339: Property 'id' does not exist on type 'never'.

92       .eq('influencer_id', influencer.id)
                                         ~~

app/api/shop/[handle]/route.ts:106:26 - error TS2339: Property 'handle' does not exist on type 'never'.

106       handle: influencer.handle,
                             ~~~~~~

app/api/shop/[handle]/route.ts:107:27 - error TS2339: Property 'first_name' does not exist on type 'never'.

107       name: `${influencer.first_name || ''} ${influencer.last_name || ''}`.trim() || 'Unknown Creator',
                              ~~~~~~~~~~

app/api/shop/[handle]/route.ts:107:58 - error TS2339: Property 'last_name' does not exist on type 'never'.

107       name: `${influencer.first_name || ''} ${influencer.last_name || ''}`.trim() || 'Unknown Creator',
                                                             ~~~~~~~~~

app/api/shop/[handle]/route.ts:108:23 - error TS2339: Property 'bio' does not exist on type 'never'.

108       bio: influencer.bio,
                          ~~~

app/api/shop/[handle]/route.ts:109:26 - error TS2339: Property 'avatar_url' does not exist on type 'never'.

109       avatar: influencer.avatar_url,
                             ~~~~~~~~~~

app/api/shop/[handle]/route.ts:110:26 - error TS2339: Property 'banner_url' does not exist on type 'never'.

110       banner: influencer.banner_url,
                             ~~~~~~~~~~

app/api/shop/[handle]/route.ts:112:28 - error TS2339: Property 'verified' does not exist on type 'never'.

112       verified: influencer.verified || false,
                               ~~~~~~~~

app/api/shop/[handle]/route.ts:113:31 - error TS2339: Property 'social_links' does not exist on type 'never'.

113       socialLinks: influencer.social_links || {}
                                  ~~~~~~~~~~~~

hooks/use-products.ts:188:20 - error TS2339: Property 'category' does not exist on type 'never'.

188           acc[item.category] = (acc[item.category] || 0) + 1
                       ~~~~~~~~

hooks/use-products.ts:188:42 - error TS2339: Property 'category' does not exist on type 'never'.

188           acc[item.category] = (acc[item.category] || 0) + 1
                                             ~~~~~~~~

lib/auth-context.tsx:35:18 - error TS2339: Property 'id' does not exist on type 'never'. 

35         id: data.id,
                    ~~

lib/auth-context.tsx:36:21 - error TS2339: Property 'email' does not exist on type 'never'.

36         email: data.email,
                       ~~~~~

lib/auth-context.tsx:37:20 - error TS2339: Property 'name' does not exist on type 'never'.

37         name: data.name,
                      ~~~~

lib/auth-context.tsx:38:20 - error TS2339: Property 'role' does not exist on type 'never'.

38         role: data.role as UserRole,
                      ~~~~

lib/auth-context.tsx:39:22 - error TS2339: Property 'avatar' does not exist on type 'never'.

39         avatar: data.avatar,
                        ~~~~~~

lib/auth-context.tsx:40:24 - error TS2339: Property 'verified' does not exist on type 'never'.

40         verified: data.verified,
                          ~~~~~~~~

lib/auth-context.tsx:41:25 - error TS2339: Property 'created_at' does not exist on type 'never'.

41         createdAt: data.created_at,
                           ~~~~~~~~~~

lib/auth-context.tsx:42:25 - error TS2339: Property 'updated_at' does not exist on type 'never'.

42         updatedAt: data.updated_at,
                           ~~~~~~~~~~

middleware.ts:75:25 - error TS2339: Property 'role' does not exist on type 'never'.      

75   const userRole = user.role
                           ~~~~


Found 88 errors in 23 files.

Errors  Files
     6  app/api/admin/users/[id]/verify/route.ts:21
     1  app/api/admin/users/route.ts:21
     8  app/api/admin/verification/[requestId]/review/route.ts:16
     1  app/api/auth/sign-in/route.ts:85
    15  app/api/checkout/route.ts:12
     4  app/api/commissions/route.ts:62
     1  app/api/dashboard/supplier/route.ts:51
     5  app/api/influencer/shop/[id]/route.ts:23
     5  app/api/influencer/shop/route.ts:53
     2  app/api/onboarding/brand/route.ts:12
     1  app/api/onboarding/docs/[id]/route.ts:11
     2  app/api/onboarding/docs/route.ts:26
     2  app/api/onboarding/influencer/route.ts:29
     3  app/api/orders/[id]/route.ts:15
     1  app/api/orders/route.ts:13
     7  app/api/products/[id]/route.ts:70
     1  app/api/products/export/route.ts:20
     2  app/api/products/import/route.ts:38
     1  app/api/products/route.ts:22
     9  app/api/shop/[handle]/route.ts:92
     2  hooks/use-products.ts:188
     8  lib/auth-context.tsx:35
     1  middleware.ts:75
 ELIFECYCLE  Command failed with exit code 2.
PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> 

pnpm build                        

> my-v0-project@0.1.0 build C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google
> next build

   ▲ Next.js 15.2.4
   - Environments: .env.local

   Creating an optimized production build ...
<w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (108kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
 ⚠ Compiled with warnings

./node_modules/.pnpm/@supabase+realtime-js@2.15.4/node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
A Node.js API is used (process.versions at line: 34) which is not supported in the Edge Runtime.
Learn more: https://nextjs.org/docs/api-reference/edge-runtime

Import trace for requested module:
./node_modules/.pnpm/@supabase+realtime-js@2.15.4/node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
./node_modules/.pnpm/@supabase+realtime-js@2.15.4/node_modules/@supabase/realtime-js/dist/module/index.js
./node_modules/.pnpm/@supabase+supabase-js@2.57.0/node_modules/@supabase/supabase-js/dist/module/index.js
./node_modules/.pnpm/@supabase+ssr@0.4.1_@supabase+supabase-js@2.57.0/node_modules/@supabase/ssr/dist/module/createBrowserClient.js
./node_modules/.pnpm/@supabase+ssr@0.4.1_@supabase+supabase-js@2.57.0/node_modules/@supabase/ssr/dist/module/index.js
./lib/supabase/middleware.ts

./node_modules/.pnpm/@supabase+realtime-js@2.15.4/node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
A Node.js API is used (process.versions at line: 35) which is not supported in the Edge Runtime.
Learn more: https://nextjs.org/docs/api-reference/edge-runtime

Import trace for requested module:
./node_modules/.pnpm/@supabase+realtime-js@2.15.4/node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
./node_modules/.pnpm/@supabase+realtime-js@2.15.4/node_modules/@supabase/realtime-js/dist/module/index.js
./node_modules/.pnpm/@supabase+supabase-js@2.57.0/node_modules/@supabase/supabase-js/dist/module/index.js
./node_modules/.pnpm/@supabase+ssr@0.4.1_@supabase+supabase-js@2.57.0/node_modules/@supabase/ssr/dist/module/createBrowserClient.js
./node_modules/.pnpm/@supabase+ssr@0.4.1_@supabase+supabase-js@2.57.0/node_modules/@supabase/ssr/dist/module/index.js
./lib/supabase/middleware.ts

./node_modules/.pnpm/@supabase+realtime-js@2.15.4/node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
A Node.js API is used (process.versions at line: 36) which is not supported in the Edge Runtime.
Learn more: https://nextjs.org/docs/api-reference/edge-runtime

Import trace for requested module:
./node_modules/.pnpm/@supabase+realtime-js@2.15.4/node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
./node_modules/.pnpm/@supabase+realtime-js@2.15.4/node_modules/@supabase/realtime-js/dist/module/index.js
./node_modules/.pnpm/@supabase+supabase-js@2.57.0/node_modules/@supabase/supabase-js/dist/module/index.js
./node_modules/.pnpm/@supabase+ssr@0.4.1_@supabase+supabase-js@2.57.0/node_modules/@supabase/ssr/dist/module/createBrowserClient.js
./node_modules/.pnpm/@supabase+ssr@0.4.1_@supabase+supabase-js@2.57.0/node_modules/@supabase/ssr/dist/module/index.js
./lib/supabase/middleware.ts

./node_modules/.pnpm/@supabase+supabase-js@2.57.0/node_modules/@supabase/supabase-js/dist/module/index.js
A Node.js API is used (process.version at line: 24) which is not supported in the Edge Runtime.
Learn more: https://nextjs.org/docs/api-reference/edge-runtime

Import trace for requested module:
./node_modules/.pnpm/@supabase+supabase-js@2.57.0/node_modules/@supabase/supabase-js/dist/module/index.js
./node_modules/.pnpm/@supabase+ssr@0.4.1_@supabase+supabase-js@2.57.0/node_modules/@supabase/ssr/dist/module/createBrowserClient.js
./node_modules/.pnpm/@supabase+ssr@0.4.1_@supabase+supabase-js@2.57.0/node_modules/@supabase/ssr/dist/module/index.js
./lib/supabase/middleware.ts

 ✓ Compiled successfully
   Linting and checking validity of types  ...Failed to compile.

./app/api/admin/users/[id]/verify/route.ts:21:39
Type error: Argument of type 'SupabaseClient<Database, "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; }; }; Views:...' is not assignable to parameter of type 'SupabaseClient<Database, "public", "public", { Tables: { users: { Row: { id: string; email: string; name: string; role: string; avatar: string | null; verified: boolean; created_at: string; updated_at: string; }; Insert: { ...; }; Update: { ...; }; Relationships: []; }; ... 7 more ...; email_verifications: { ...; };...'.

  19 |   try {
  20 |     const supabase = await createServerSupabaseClient()
> 21 |     const user = await getCurrentUser(supabase)
     |                                       ^
  22 |     if (!user || !hasRole(user, [UserRole.ADMIN])) {
  23 |       return NextResponse.json(
  24 |         { ok: false, message: "Unauthorized" },
Next.js build worker exited with code: 1 and signal: null
 ELIFECYCLE  Command failed with exit code 1.
PS C:\Users\LENOVO\Desktop\Workspce\vo-onelink-google> 