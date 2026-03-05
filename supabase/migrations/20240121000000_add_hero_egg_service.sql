-- Add HERO EGG to services table safely
INSERT INTO public.services (name, description)
SELECT 'HERO EGG', 'HERO EGG service category'
WHERE NOT EXISTS (
    SELECT 1 FROM public.services WHERE name = 'HERO EGG'
);