import { useState, useCallback } from 'react';
import { Mail, Github, Linkedin, ArrowUpRight, Check, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { usePageMeta } from '../hooks/usePageMeta';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    name: 'Email',
    value: 'namanjainakt@gmail.com',
    href: 'mailto:namanjainakt@gmail.com',
  },
  {
    icon: Github,
    name: 'GitHub',
    value: 'github.com/namanjainakt',
    href: 'https://github.com/namanjainakt',
  },
  {
    icon: Linkedin,
    name: 'LinkedIn',
    value: 'linkedin.com/in/naman-jain-akt',
    href: 'https://linkedin.com/in/naman-jain-akt',
  },
];

const Contact = () => {
  usePageMeta({
    title: 'Contact — Get in Touch with Naman Jain',
    description:
      'Get in touch with Naman Jain for full-time opportunities, freelance projects, technical advising, or questions about software architecture.',
    path: '/contact',
  });

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (value.length < 2) return 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
        break;
      case 'message':
        if (value.length < 10) return 'Message must be at least 10 characters';
        break;
    }
    return undefined;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: FormErrors = {};
      Object.keys(formData).forEach((key) => {
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) newErrors[key as keyof FormErrors] = error;
      });
      setErrors(newErrors);
      setTouched({ name: true, email: true, message: true });
      if (Object.keys(newErrors).length > 0) return;

      setIsSubmitting(true);

      try {
        const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
          setErrors((prev) => ({
            ...prev,
            message: 'Contact form is not configured. Please email me directly.',
          }));
          setIsSubmitting(false);
          return;
        }

        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_name: 'Naman',
            to_email: 'namanjainakt@gmail.com',
          },
          PUBLIC_KEY
        );

        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTouched({});
      } catch {
        setErrors((prev) => ({ ...prev, message: 'Message failed to send. Please try again.' }));
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateField]
  );

  const inputClasses = (hasError: boolean) =>
    `w-full border bg-background px-3 py-2.5 text-sm text-primary outline-none transition-colors duration-200 placeholder:text-tertiary ${
      hasError ? 'border-warning focus:border-warning' : 'border-line focus:border-primary'
    }`;

  return (
    <div className="frame">
      <div className="hatch h-2.5 border-b border-line" aria-hidden="true" />

      <section className="border-b border-line">
        <div className="page-column py-12 sm:py-16">
          <p className="mono-label">Contact</p>
          <h1 className="mt-4 text-4xl font-medium tracking-tightest sm:text-6xl">
            Let&apos;s talk.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-secondary">
            A new project, a role, or a question about something I&apos;ve written. I read
            everything and usually reply within a day or two.
          </p>
        </div>
      </section>

      <section>
        <div className="page-column py-10 sm:py-14">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <p className="mono-label">Direct</p>
              <div className="mt-3 border-t border-line">
                {CONTACT_CHANNELS.map((channel) => (
                  <a
                    key={channel.name}
                    href={channel.href}
                    target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 border-b border-line py-4 transition-colors duration-200 hover:bg-surface"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <channel.icon size={15} strokeWidth={1.6} className="shrink-0 text-tertiary" />
                      <span className="min-w-0">
                        <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-tertiary">
                          {channel.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[13px] text-primary">
                          {channel.value}
                        </span>
                      </span>
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="shrink-0 text-tertiary transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </a>
                ))}
              </div>

              <div className="mt-8 border-t border-line">
                <div className="meta-row">
                  <span className="mono-label">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-[13px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Open to work
                  </span>
                </div>
                <div className="meta-row">
                  <span className="mono-label">Based in</span>
                  <span className="text-[13px]">Bhilai, Chhattisgarh</span>
                </div>
                <div className="meta-row">
                  <span className="mono-label">Calls</span>
                  <a
                    href="https://cal.com/naman-jain-akt/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-[13px] text-secondary hover:text-primary"
                  >
                    Book 30 minutes
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <p className="mono-label">Message</p>

              {submitted ? (
                <div className="mt-3 border border-line p-8 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-line">
                    <Check size={20} />
                  </div>
                  <h2 className="mt-4 text-lg font-medium tracking-tight">Message sent</h2>
                  <p className="mt-1.5 text-sm text-secondary">
                    Thanks for reaching out. I&apos;ll get back to you soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn-outline mt-6"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-3 space-y-5" noValidate>
                  <div>
                    <label htmlFor="name" className="mono-label">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your name"
                      aria-invalid={!!errors.name}
                      className={`mt-2 ${inputClasses(!!errors.name)}`}
                    />
                    {errors.name && <p className="mt-1.5 text-[11px] text-warning">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="mono-label">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      className={`mt-2 ${inputClasses(!!errors.email)}`}
                    />
                    {errors.email && <p className="mt-1.5 text-[11px] text-warning">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="mono-label">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="What are you working on?"
                      aria-invalid={!!errors.message}
                      className={`mt-2 resize-y ${inputClasses(!!errors.message)}`}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-[11px] text-warning">{errors.message}</p>
                    )}
                  </div>

                  <button type="submit" disabled={isSubmitting} className="btn-solid w-full disabled:opacity-60">
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Sending
                      </>
                    ) : (
                      <>
                        Send message
                        <ArrowUpRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="hatch h-2.5 border-t border-line" aria-hidden="true" />
    </div>
  );
};

export default Contact;
