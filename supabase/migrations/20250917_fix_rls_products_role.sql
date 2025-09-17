-- Tighten products RLS to require supplier role (or admin) for writes

-- Remove previous write policies to replace with role-aware versions
DROP POLICY IF EXISTS "Products insert by supplier or admin" ON public.products;
DROP POLICY IF EXISTS "Products update by supplier or admin" ON public.products;
DROP POLICY IF EXISTS "Products delete by supplier or admin" ON public.products;

-- INSERT: only suppliers can insert their own products, or admins can insert any
CREATE POLICY "Products insert by SUPPLIER or ADMIN (role-aware)"
ON public.products
FOR INSERT
WITH CHECK (
  (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'supplier'
    )
    AND auth.uid() = supplier_id
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- UPDATE: supplier can update own rows, admin can update any
CREATE POLICY "Products update by SUPPLIER or ADMIN (role-aware)"
ON public.products
FOR UPDATE
USING (
  (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'supplier'
    )
    AND auth.uid() = supplier_id
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
)
WITH CHECK (
  (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'supplier'
    )
    AND auth.uid() = supplier_id
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- DELETE: supplier can delete own rows, admin can delete any
CREATE POLICY "Products delete by SUPPLIER or ADMIN (role-aware)"
ON public.products
FOR DELETE
USING (
  (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'supplier'
    )
    AND auth.uid() = supplier_id
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);
