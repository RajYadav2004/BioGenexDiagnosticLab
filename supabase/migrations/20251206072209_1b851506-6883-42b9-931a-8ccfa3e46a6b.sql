-- Create reports storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true);

-- Allow admins to upload reports
CREATE POLICY "Admins can upload reports"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'reports' AND 
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to update reports
CREATE POLICY "Admins can update reports"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'reports' AND 
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to delete reports
CREATE POLICY "Admins can delete reports"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'reports' AND 
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow users to view their own reports (path starts with their user_id)
CREATE POLICY "Users can view their own reports"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'reports' AND 
  (
    public.has_role(auth.uid(), 'admin'::public.app_role) OR
    (storage.foldername(name))[1] = auth.uid()::text
  )
);