-- Add delete policy for admins on test_reports
CREATE POLICY "Admins can delete reports"
ON public.test_reports
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));