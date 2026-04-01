import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, MessageSquare, Phone } from 'lucide-react';

const InputField = ({ label, name, type = "text", value, onChange, required = true }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative group">
      <motion.label
        initial={false}
        animate={{
          y: (focused || value) ? -28 : 0,
          scale: (focused || value) ? 0.8 : 1,
          color: focused ? "var(--color-accent-blue)" : "rgba(156, 163, 175, 1)",
        }}
        className="absolute left-0 top-4 text-gray-400 pointer-events-none transition-colors duration-300 font-orbitron text-xs tracking-widest uppercase"
      >
        {label}
      </motion.label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent border-b-2 border-white/5 py-4 outline-none transition-all duration-500 focus:border-accent-blue font-light text-lg"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-blue origin-left shadow-[0_0_15px_rgba(0,242,255,0.5)]"
      />
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "f876804c-d8de-4cde-9965-003e943c4719",
          ...formData,
          from_name: formData.name, // Helpful for Web3Forms
          subject: `Nouveau message de ${formData.name}: ${formData.subject}`
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        console.error("Web3Forms Error:", result);
        setStatus("error");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent-blue/5 blur-[150px] -z-10"></div>

      <div className="mb-20 text-center">
        <h2 className="text-4xl md:text-7xl font-black mb-6 uppercase tracking-tighter">Parlons de <span className="text-accent-blue">Projet</span></h2>
        <p className="text-gray-500 uppercase tracking-[0.4em] text-xs font-bold font-orbitron">Disponible pour des collaborations mondiales</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-black mb-8 uppercase tracking-widest">Travaillons <span className="text-accent-blue font-light italic">Ensemble</span></h3>
          <p className="text-gray-400 mb-12 text-lg font-light leading-relaxed">
            Vous avez une idée visionnaire ? Un projet complexe ? Ou simplement besoin d'une expertise technique de haut niveau ?
            Je suis là pour transformer vos concepts en expériences numériques exceptionnelles.
          </p>

          <div className="space-y-6">
            <a href="mailto:youssefzh850@gmail.com" className="flex items-center gap-6 p-6 glass-card rounded-3xl border border-white/5 hover:border-accent-blue/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:bg-accent-blue group-hover:text-black transition-all">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Email Direct</p>
                <p className="text-lg font-bold text-white">youssefzh850@gmail.com</p>
              </div>
            </a>

            <a href="https://wa.me/yournumber" className="flex items-center gap-6 p-6 glass-card rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">WhatsApp Business</p>
                <p className="text-lg font-bold text-white">Démarrer une discussion</p>
              </div>
            </a>

            <div className="flex items-center gap-6 p-6 glass-card rounded-3xl border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Localisation</p>
                <p className="text-lg font-bold text-white">Maroc, Skhirate</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card p-10 md:p-16 rounded-[3.5rem] border border-white/5 relative group"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-blue/5 blur-3xl -z-10 group-hover:bg-accent-blue/10 transition-all duration-700"></div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-8 text-accent-blue">
                <Send size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Message Envoyé !</h3>
              <p className="text-gray-400 mb-8">Merci pour votre message. Je vous répondrai dans les plus brefs délais.</p>
              <button
                onClick={() => setStatus("idle")}
                className="text-accent-blue font-orbitron text-xs tracking-widest uppercase hover:underline"
              >
                Envoyer un autre message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid md:grid-cols-2 gap-12">
                <InputField
                  label="Votre Nom"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <InputField
                  label="Votre Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <InputField
                label="Sujet"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
              <div className="relative group">
                <label className="block text-gray-400 font-orbitron text-xs tracking-widest uppercase mb-4">
                  Votre Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 outline-none focus:border-accent-blue/50 transition-all duration-500 text-lg font-light resize-none"
                ></textarea>
              </div>

              <motion.button
                type="submit"
                disabled={status === "submitting"}
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(0, 242, 255, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-6 bg-accent-blue text-black rounded-full font-orbitron font-black text-xs tracking-[0.4em] hover:bg-white transition-all shadow-xl shadow-accent-blue/10 relative overflow-hidden group/btn ${status === "submitting" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {status === "submitting" ? "ENVOI EN COURS..." : "ENVOYER LE MESSAGE"}
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-1/3 h-full bg-white/20 skew-x-12 z-0"
                />
              </motion.button>

              {status === "error" && (
                <p className="text-red-500 text-xs text-center font-orbitron uppercase tracking-widest mt-4">
                  Une erreur est survenue. Veuillez réessayer.
                </p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
