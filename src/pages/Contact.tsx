import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    subject: false,
    message: false
  });

  const subjectOptions = [
    "Custom Furniture Inquiry",
    "Wholesale Pricing Information",
    "Visit Showroom",
    "Furniture for Home/Office",
    "Product Availability",
    "General Inquiry"
  ];

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone: string) => {
    if (phone && !/^[\d\s+()-]+$/.test(phone)) {
      return 'Phone number can only contain digits, spaces, +, -, ( )';
    }
    if (phone && phone.replace(/\D/g, '').length < 10) {
      return 'Phone number must be at least 10 digits';
    }
    return '';
  };

  const validateSubject = (subject: string) => {
    if (!subject) return 'Please select an inquiry type';
    return '';
  };

  const validateMessage = (message: string) => {
    if (!message.trim()) return 'Message is required';
    if (message.trim().length < 10) return 'Message must be at least 10 characters';
    if (message.trim().length > 1000) return 'Message must not exceed 1000 characters';
    return '';
  };

  // Handle field blur
  const handleBlur = (field: keyof typeof formData) => {
    setTouched({ ...touched, [field]: true });
    
    let error = '';
    switch (field) {
      case 'name':
        error = validateName(formData.name);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        break;
      case 'subject':
        error = validateSubject(formData.subject);
        break;
      case 'message':
        error = validateMessage(formData.message);
        break;
    }
    setErrors({ ...errors, [field]: error });
  };

  // Handle input change
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (touched[field]) {
      let error = '';
      switch (field) {
        case 'name':
          error = validateName(value);
          break;
        case 'email':
          error = validateEmail(value);
          break;
        case 'phone':
          error = validatePhone(value);
          break;
        case 'subject':
          error = validateSubject(value);
          break;
        case 'message':
          error = validateMessage(value);
          break;
      }
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    const subjectError = validateSubject(formData.subject);
    const messageError = validateMessage(formData.message);
    
    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError,
      subject: subjectError,
      message: messageError
    });
    
    setTouched({
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true
    });
    
    // Check if there are any errors
    if (nameError || emailError || phoneError || subjectError || messageError) {
      return;
    }
    
    // Build WhatsApp message
    let message = `*New Contact Form Inquiry*\n\n`;
    message += `*Name:* ${formData.name}\n`;
    message += `*Email:* ${formData.email}\n`;
    if (formData.phone) message += `*Phone:* ${formData.phone}\n`;
    message += `*Subject:* ${formData.subject}\n\n`;
    message += `*Message:*\n${formData.message}`;
    
    // Encode and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918590774213?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    // Reset errors and touched
    setErrors({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    setTouched({
      name: false,
      email: false,
      phone: false,
      subject: false,
      message: false
    });
  };
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-36 pb-24">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <div className="inline-block mb-4">
            <div className="h-1 w-16 bg-primary rounded-full mx-auto" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">Edakkattu Furniture</h2>
          <p className="text-lg text-primary font-semibold mb-6">Teakacacia LLP</p>
          
          <h1 className="heading-font text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground mb-6 tracking-tight">
            Get In Touch
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Custom furniture solutions | Wholesale inquiries welcome<br/>
            We manufacture all types of sofas and furniture according to your choice.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="heading-font text-2xl font-medium text-foreground mb-8">
                  Contact Edakkattu Furniture
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Email</h3>
                      <p className="text-muted-foreground">info@teakacacia.com</p>
                      <p className="text-muted-foreground">For wholesale & custom orders</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Phone & WhatsApp</h3>
                      <div className="space-y-1">
                        <p className="text-muted-foreground font-medium">+91 8590774213</p>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => window.open('tel:+918590774213', '_self')}
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            <Phone className="h-3 w-3" />
                            Call Now
                          </button>
                          <span className="text-muted-foreground">•</span>
                          <button 
                            onClick={() => window.open('https://wa.me/918590774213?text=Hello! I\'m interested in your furniture products.', '_blank')}
                            className="text-sm text-green-600 hover:underline flex items-center gap-1"
                          >
                            <MessageCircle className="h-3 w-3" />
                            WhatsApp
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">Mon-Sat: 9AM - 6PM IST</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-2">Manufacturing Hubs</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-foreground">Kerala, India</p>
                          <p className="text-sm text-muted-foreground">Wholesale & Manufacturing</p>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Bangalore, India</p>
                          <p className="text-sm text-muted-foreground">Wholesale & Manufacturing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-8 rounded-sm">
                <h3 className="heading-font text-xl font-medium text-foreground mb-4">
                  Custom Furniture Solutions
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  We specialize in customizing furniture according to your specific requirements. 
                  Whether you need wholesale orders or custom-made pieces, our team is ready to help.
                </p>
                <Button variant="outline" className="w-full sm:w-auto">
                  Schedule a Visit
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <form onSubmit={handleSubmit} className="space-y-6 bg-muted/20 p-8 rounded-sm">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`w-full px-4 py-3 border rounded-sm bg-background focus:outline-none focus:ring-2 transition-smooth ${
                      errors.name && touched.name
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-border focus:ring-primary/50'
                    }`}
                    placeholder="Rajesh Kumar"
                  />
                  {errors.name && touched.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full px-4 py-3 border rounded-sm bg-background focus:outline-none focus:ring-2 transition-smooth ${
                      errors.email && touched.email
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-border focus:ring-primary/50'
                    }`}
                    placeholder="rajesh@gmail.com"
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full px-4 py-3 border rounded-sm bg-background focus:outline-none focus:ring-2 transition-smooth ${
                      errors.phone && touched.phone
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-border focus:ring-primary/50'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => {
                      handleChange('subject', value);
                      setTouched({...touched, subject: true});
                    }}
                  >
                    <SelectTrigger className={`w-full px-4 py-3 border rounded-sm bg-background focus:outline-none focus:ring-2 transition-smooth ${
                      errors.subject && touched.subject
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-border focus:ring-primary/50'
                    }`}>
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subject && touched.subject && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    onBlur={() => handleBlur('message')}
                    className={`w-full px-4 py-3 border rounded-sm bg-background focus:outline-none focus:ring-2 transition-smooth resize-none ${
                      errors.message && touched.message
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-border focus:ring-primary/50'
                    }`}
                    placeholder="I am interested in custom teak furniture for my home. Please provide details about pricing and availability..."
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.message && touched.message ? (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span>⚠</span> {errors.message}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {formData.message.length}/1000 characters
                      </p>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Send via WhatsApp
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
