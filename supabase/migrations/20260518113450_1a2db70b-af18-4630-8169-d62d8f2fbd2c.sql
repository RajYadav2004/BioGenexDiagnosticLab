-- Explicit deny policies on user_roles to prevent any privilege escalation via API
CREATE POLICY "No one can insert roles via API"
ON public.user_roles
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

CREATE POLICY "No one can update roles via API"
ON public.user_roles
FOR UPDATE
TO authenticated, anon
USING (false);

CREATE POLICY "No one can delete roles via API"
ON public.user_roles
FOR DELETE
TO authenticated, anon
USING (false);