-- Create storage bucket for reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for reports bucket
CREATE POLICY "Admins can upload reports."
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'reports' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update reports."
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'reports' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete reports."
ON storage.objects FOR DELETE
USING (
  bucket_id = 'reports' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can view all report files."
ON storage.objects FOR SELECT
USING (
  bucket_id = 'reports' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Users can view their own report files."
ON storage.objects FOR SELECT
USING (
  bucket_id = 'reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);