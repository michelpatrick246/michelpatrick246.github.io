import { useState, useEffect, useRef } from 'react';
import { 
  Github, Linkedin, Moon, Sun, Cloud, GitBranch, 
  ChevronLeft, ChevronRight, X, GraduationCap, Award, 
  Clock, Calendar, Building2, Server, Gitlab, Users,
  Shield, BarChart,
  Database, Mail,
  Play
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';


interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

const longDescriptionProject = [
  {
    id: 1, 
    description: `Ce projet, réalisé dans le cadre d'un cours avancé sur DevOps, 
                  consistait à créer une infrastructure complète pour une petite entreprise. 
                  L'objectif était de combiner des outils comme Ansible, Docker, Traefik et 
                  GitLab CI/CD pour fournir une solution auto-hébergée, sécurisée et facile à 
                  reproduire. L'infrastructure a été déployée sur Linode, un fournisseur de cloud, et comprend :
                  `,
    details: [
      {
        title: "Automatisation", 
        text: "Configuration du serveur et déploiement des services avec Ansible"
      },
      {
        title: "Sécurité",
        text: "Gestion des certificats TLS avec Let's Encrypt et Traefik, et accès sécurisé via WireGuard."
      },
      {
        title: "Collaboration",
        text: "Mise en place de Zulip pour la communication et Nextcloud pour le partage de fichiers."
      },
      {
        title: "Surveillance",
        text: "Surveillance en temps réel avec Checkmk."
      },
      {
        title: "Sauvegarde",
        text: "Sauvegardes automatisées en utilisant un script bash"
      }
    ]
  },
  {
    id: 2,
    description: `Ce projet consistait à développer une API REST de gestion bancaire en utilisant 
                  une architecture microservices. L'objectif était de créer un système modulaire, 
                  scalable et facile à maintenir. Les fonctionnalités incluent :
                  `,
    details: [
      {
        title: "Service Discovery",
        text: "Utilisation d'Eureka pour la découverte dynamique des services."
      },
      {
        title: "Gateway",
        text: "Mise en place d'une Gateway avec Spring Cloud Gateway pour gérer les requêtes entrantes et le routage."
      },
      {
        title: "Config Service",
        text: " Centralisation des configurations avec Spring Cloud Config pour une gestion simplifiée"
      },
      {
        title: "Microservices",
        text: " Développement de services indépendants pour gérer les comptes, les transactions et les utilisateurs."
      }
    ]
  },
  {
    id: 3,
    description: `Ce projet consistait à déployer une infrastructure cloud complète sur Infomaniak, 
                  en mettant l'accent sur l'automatisation, l'observabilité et la scalabilité. 
                  L'objectif était de créer un système dynamique et facile à maintenir, 
                  capable de s'adapter aux besoins changeants.
                  `,
    details: [
      {
        title: "Automatisation",
        text: "Configuration et gestion des instances avec Ansible et Terraform."
      },
      {
        title: "Observabilité",
        text: "Centralisation des logs avec Loki, Génération des metrics système avec Node Exporter,collecte de métriques avec Victoria Agent, stockage des metrics avec vmetrics et visualisation avec Grafana."
      },
      {
        title: "Alerting",
        text: "Génération d'alertes avec vmalert et notification via AlertManager"
      },
      {
        title: "Scalabilité",
        text: "Ajout automatique de nouvelles machines sans nécessiter de reconfiguration manuelle, grâce à Consul."
      },
      {
        title: "Sécurité",
        text: "Accès sécurisé via OpenVPN et gestion des certificats TLS avec Traefik."
      },
      {
        title: "Sauvegarde",
        text: "Sauvegarde automatisée des données de Consul avec Restic et stockage dans un bucket S3."
      }
    ]
  },
  {
    id: 4,
    description: `Dans le cadre de mon stage en entreprise pour l'obtention de ma licence 
                  professionnelle, j'ai développé une application web de gestion de recensement. 
                  Ce projet m'a permis de maîtriser les concepts de développement full-stack et de 
                  travailler en équipe dans un environnement professionnel. Fonctionnalités clés:
                `,
    details: [
      {
        title: "Backend",
        text: `Développement d'une API REST avec Spring Boot pour gérer les données de recensement, 
              Connexion à une base de données MySQL pour stocker les informations, 
              Gestion des utilisateurs et des permissions avec Spring Security et Envoie notification par sms.`
      },
      {
        title: "Frontend",
        text: "Interface utilisateur intuitive développée avec React."
      }
    ]
  },
  {
    id: 5,
    description: `Ce projet consistait à mettre en place un pipeline CI/CD complet pour 
                  l'application gestion de recensement, en utilisant GitLab CI pour les étapes 
                  de test et de build, et FluxCD pour automatiser le déploiement sur un cluster Kubernetes.
                  Fonctionnalités clés: 
                  `,
    details: [
      {
        title: "Pipeline CI/CD",
        text: `Configuration d'un pipeline GitLab CI pour exécuter des tests unitaires, 
              construire des images Docker et les pousser vers le registre privé GitLab 
              Container Registry.
              `
      },
      {
        title: "Déploiement automatisé",
        text: ` Utilisation de FluxCD pour synchroniser les déploiements avec le cluster Kubernetes et
                gestion des manifestes Kubernetes via Git (GitOps).
              `
      },
      {
        title: "Intégration avec l'infrastructure existante",
        text: "Déploiement sur le cluster Kubernetes mentionné dans mon projet précédent."
      }
    ]
  }
]

const skillCategories = [
  {
    title: "Infrastructure & Cloud",
    icon: <Cloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    skills: [
      "Kubernetes",
      "Docker",
      "Terraform, Ansible",
      "OpenStack, linode vps"
    ]
  },
  {
    title: "CI/CD & Automatisation",
    icon: <Gitlab className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    skills: [
      "GitLab CI/CD (déploiements automatisés)",
      "FluxCD (GitOps)",
    ]
  },
  {
    title: "Sécurité & Réseau",
    icon: <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    skills: [
      "OpenVPN",
      "TLS (Certificats Let's Encrypt avec Traefik)",
      "Gestion des permissions Kubernetes (RBAC, NetworkPolicy)"
    ]
  },
  {
    title: "Monitoring & Logs",
    icon: <BarChart className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    skills: [
      "Grafana",
      "Victoria metrics",
      "Loki",
    ]
  },
  {
    title: "Backend",
    icon: <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    skills: [
      "Spring framework"
    ]
  }
];

// Project data
const projects = [
  {
    id: 1,
    title: "Infrastructure DevOps complète : Automatisation, surveillance et sauvegarde pour une petite entreprise",
    description: "Déploiement d'une infrastructure DevOps auto-hébergée et automatisée sur linode, incluant des services comme Nextcloud, Zulip, Pi-hole et une surveillance avec Checkmk. Réalisé avec Ansible, Docker, Traefik et GitLab CI/CD.",
    icon: <Cloud className="w-8 h-8" />,
    tech: ["Linode", "Ansible", "Docker", "Traefik", "GitLab CI/CD", "WireGuard", "Borg", "Checkmk", "Nextcloud", "Zulip", "Pi-hole", "iRedMail", "Mysql"],
    longDescription: longDescriptionProject[0],
    images: [
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1667372393749-0af6ae3d5aee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1667372394195-f5e8f2aa3fae?auto=format&fit=crop&w=1200&q=80"
    ],
     demoGif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzY3ODY5MjRiNjY5ZmQ5ZjBiZjBkZjM5ZjI5ZjM5ZjQ5ZjM5ZjM5ZiZjdD1n/3oKIPnAiaMCws8nOsE/giphy.gif"
  },
  {
    id: 2,
    title: "API REST de gestion bancaire avec architecture microservices et Spring Boot",
    description: "Développement d'une API REST pour la gestion bancaire, utilisant une architecture microservices avec Spring Boot, Service Discovery, Gateway et un Config Service pour centraliser les configurations.",
    icon: <Server className="w-8 h-8" />,
    tech: ["Spring Boot", "Spring Cloud", "Spring Cloud Gateway", "Spring Cloud Config", "Eureka", "h2","Git", "Maven"],
    longDescription: longDescriptionProject[1],
    images: [
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618401471578-39cd9c0e41c5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618401471668-9e86f7e8a85a?auto=format&fit=crop&w=1200&q=80"
    ],
     demoGif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzY3ODY5MjRiNjY5ZmQ5ZjBiZjBkZjM5ZjI5ZjM5ZjQ5ZjM5ZjM5ZiZjdD1n/3oKIPnAiaMCws8nOsE/giphy.gif"
  },
  {
    id: 3,
    title: "Infrastructure cloud automatisée",
    description: "Déploiement d'une infrastructure cloud sur Infomaniak avec automatisation (Ansible, Terraform), monitoring (Grafana, Loki, Victoria Metrics), et système d'alertes (vmalert, AlertManager) pour une gestion proactive des incidents.",
    icon: <Cloud className="w-8 h-8" />,
    tech: ["Infomaniak", "Ansible", "Terraform", "Kubernetes", "Grafana", "vmetrics", "Loki", "OpenVPN", "Traefik", "Consul", "Restic"],
    longDescription: longDescriptionProject[2],
    images: [
      "infra_cloud/topologie reseaux.png",
      "infra_cloud/consul service.png",
      "infra_cloud/config consul.png",
      "infra_cloud/dashboard traefik.png",
      "infra_cloud/task installation consul.png",
      "infra_cloud/metric consul1 grafana.png",
      "infra_cloud/log system consul2.png",
      "infra_cloud/Création instance terraform.png",
      "infra_cloud/alert manager.png",
      "infra_cloud/config alert node_exporter.png"
    ],
     demoGif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzY3ODY5MjRiNjY5ZmQ5ZjBiZjBkZjM5ZjI5ZjM5ZjQ5ZjM5ZjM5ZiZjdD1n/3oKIPnAiaMCws8nOsE/giphy.gif"
  },
  {
    id: 4,
    title: "Application web de gestion de recensement",
    description: "Développement d'une application web full-stack pour la gestion de recensement, utilisant Spring Boot pour le backend et React pour le frontend, dans le cadre d'un stage en entreprise.",
    icon: <Server className="w-8 h-8" />,
    tech: ["Spring Boot", "Spring Security", "React", "MySQL", "Git", "2TUP"],
    longDescription: longDescriptionProject[3],
    images: [
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516116412344-4d8cbf3ad538?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: 5,
    title: "Pipeline CI/CD avec GitLab CI et déploiement automatisé sur Kubernetes avec FluxCD",
    description: "Création d'un pipeline CI/CD avec GitLab CI pour tester et builder l'application gestion de recensement, et automatisation du déploiement sur un cluster Kubernetes avec FluxCD.",
    icon: <GitBranch className="w-8 h-8" />,
    tech: ["GitLab CI", "GitLab Container Registry", "FluxCD", "Kubernetes", "Docker", "Git", "GitOps"],
    longDescription: longDescriptionProject[4],
    images: [
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516116412344-4d8cbf3ad538?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80"
    ]
  }
];

// Education data
const education = [
  {
    type: "diploma",
    title: "Licence en informatique",
    institution: "ENI Fianarantsoa, Madagascar",
    period: "2023",
    icon: <GraduationCap className="w-6 h-6" />,
    description: "Spécialisé en Génie Logiciel et Systèmes Distribués"
  },
  {
    type: "diploma",
    title: "Master en informatique",
    institution: "ENI Fianarantsoa, Madagascar",
    period: "2023-present",
    icon: <GraduationCap className="w-6 h-6" />,
    description: "Spécialisé en Génie Logiciel et Systèmes Distribués"
  },
];

const experienceData: Experience[] = [
  {
    title: "Conception et réalisation d'une application gestion des recensements (stage)",
    company: 'Ministère de la Jeunesse et Sport, Madagascar',
    period: 'Août 2023 - Novembre 2023',
    description: "Développement d'une application web full-stack pour la gestion de recensement, utilisant Spring Boot pour le backend et React pour le frontend, dans le cadre d'un stage en entreprise.",
    technologies: ['Spring boot', 'Spring security', 'React', 'Mysql', "Git", "2TUP"],
  }
];

function FullscreenImage({ src, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X className="w-8 h-8" />
      </button>
      <img
        src={src}
        alt="Fullscreen view"
        className="max-w-full max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [project.images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row h-full">
          <div className="md:w-1/2 relative">
            <div className="sticky top-0 p-6">
            {showDemo ? (
                <img
                  src={project.demoGif}
                  alt="Demo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={project.images[currentImageIndex]}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setFullscreenImage(project.images[currentImageIndex])}
                />
              )}

              {!showDemo && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="absolute bottom-10 right-10 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors duration-300"
              >
                <Play className="w-4 h-4" />
                {showDemo ? 'Voir les images' : 'Démo Live'}
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 p-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {project.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {project.longDescription.description}
            </p>
            <ul className='text-gray-600 dark:text-gray-300 mb-6 list-inside list-disc'>
                {project.longDescription.details.map((detail, index) => (
                  <li key={index}>
                    <strong className="dark:text-gray-300">{detail.title} :</strong> {detail.text}
                  </li>
                ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, index) => (
                <span
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {fullscreenImage && (
        <FullscreenImage
          src={fullscreenImage}
          onClose={() => setFullscreenImage(null)}
        />
      )}
    </div>
  );
}


const getIcon = (type: string) => {
  switch (type) {
    case 'diploma':
      return <GraduationCap className="w-6 h-6" />;
    case 'certification':
      return <Award className="w-6 h-6" />;
    case 'training':
      return <Clock className="w-6 h-6" />;
    default:
      return <GraduationCap className="w-6 h-6" />;
  }
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      return savedTheme ? savedTheme === 'dark' : prefersDark;
    }
    return false;
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(); 
  //Education ref
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]); 
  const experienceRefs = useRef<(HTMLDivElement | null)[]>([]);

  const API_KEY_EMAIL_JS = import.meta.env.VITE_API_KEY_EMAIL_JS

  useEffect(() => {
    emailjs.init(API_KEY_EMAIL_JS); // Replace with your EmailJS public key
  }, []);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (!localStorage.getItem('theme')) {
          setDarkMode(e.matches);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-x-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    experienceRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);


  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log(formRef.current)
      const result = await emailjs.sendForm(
        'service_3vqxb3s', // Replace with your EmailJS service ID
        'template_er1kdn9', // Replace with your EmailJS template ID
        formRef.current
      );

      if (result.status === 200) {
        toast.success('Message envoyé avec succès!');
        e.target.reset();
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      console.error('Email error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Toaster position="top-right" />
        
        {/* Header */}
        <header className="fixed w-full bg-white dark:bg-gray-800 shadow-md z-50">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Michel Patrick</div>
              <div className="flex items-center space-x-8">
                <a href="#about" className="hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Accueil</a>
                <a href="#projects" className="hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Projets</a>
                <a href="#skills" className="hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Compétences</a>
                <a href="#education" className="hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Éducation</a>
                <a href="#contact" className="hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Contact</a>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </nav>
        </header>

        {/* About Section */}
        <section id="about" className="py-20 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}  
                className="md:w-1/2"
                >
                <div className="inline-block mt-4">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-md dark:bg-blue-900 dark:text-blue-300">
                  🚀 DevOps Engineer
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
                  Je suis <br />
                  TOVONJANAHARY Michel Patrick
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-xl mt-4 mb-6 leading-relaxed">
                  Passionné par la construction d’infrastructures et le déploiement d’applications, j’ai commencé par le développement web avant de découvrir la philosophie DevOps. Depuis, je me forme activement à l'automatisation et à l’optimisation des déploiements. Je suis à la recherche d’une opportunité pour mettre en pratique mes compétences et continuer à apprendre au sein d’une équipe dynamique.
                </p>
                
                {/* <h2
                  className="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
                  >
                  À propos de moi
                </h2>
                <p
                  className="text-gray-600 dark:text-gray-300 mb-6"
                >
                  Je m'appelle TOVONJANAHARY Michel Patrick, passionné par l'automatisation et les infrastructures cloud. 
                  Ayant une bonne maîtrise des outils d'automatisation et une expérience pratique dans le déploiement d'applications sur le cloud, 
                  je suis motivé à renforcer mes compétences et à contribuer à des projets innovants.
                </p> */}
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/michelpatrick246"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a
                    href="mailto:michelpatrick246@gmail.com"
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Mail className="w-6 h-6" />
                  </a>
                </div>
              </motion.div>
              <div className="md:w-1/2">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="relative w-72 h-72 mx-auto"
                >
                  <motion.img
                    src="profil.jpg"
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                  
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-6 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">Mes Projets</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                key={project.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className=" bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 hover:transform hover:scale-105 cursor-pointer"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4">{project.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
            </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">
              Compétences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {skillCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className=" bg-gray-50 dark:bg-gray-800 rounded-lg opacity-0 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {category.icon}
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {category.skills.map((skill) => (
                      <li 
                        key={skill}
                        className="text-gray-600 dark:text-gray-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
          <div className="flex items-center justify-center mb-16">
              <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Formation & Expérience
              </h2>
            </div>
            <div className='grid grid-cols-2 gap-8'>

             {/* Formation & Certifications */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 h-full w-0.5 bg-blue-200 dark:bg-blue-900" />

                <div className="space-y-12">
                  {education.map((item, index) => (
                    <div
                      key={index}
                      ref={(el) => (itemRefs.current[index] = el)}
                      className="relative pl-20 opacity-0 translate-x-8 transition-all duration-700"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      {/* Timeline dot and icon */}
                      <div className="absolute left-6 transform -translate-x-1/2 flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full" />
                        <div className="absolute -left-8 w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
                          {getIcon(item.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {item.title}
                          </h3>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Building2 className="w-4 h-4 mr-2" />
                            {item.institution}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Calendar className="w-4 h-4 mr-2" />
                            {item.period}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mt-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
              </div>

              {/* Expérience Professionnelle */}
              <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 h-full w-0.5 bg-blue-200 dark:bg-blue-900" />

              <div className="space-y-12">
                {experienceData.map((item, index) => (
                  <div
                    key={index}
                    ref={(el) => (experienceRefs.current[index] = el)}
                    className="relative pl-20 opacity-0 translate-x-8 transition-all duration-700"
                    style={{ animationDelay: `${index * 500}ms` }}
                  >
                    {/* Timeline dot and icon */}
                    <div className="absolute left-6 transform -translate-x-1/2 flex items-center justify-center">
                      <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full" />
                      <div className="absolute -left-8 w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        {item.title}
                      </h3>

                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Building2 className="w-4 h-4 mr-2" />
                          {item.company}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          {item.period}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {item.description}
                        </p>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        </section>


        {/* Contact Section */}
        <section id="contact" className="py-20 px-6 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">Contact</h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="from_name" className="block text-gray-700 dark:text-gray-300 mb-2">Nom <span style={{"color": "tomato"}}>*</span></label>
                <input
                  type="text"
                  id="from_name"
                  name="from_name"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="from_email" className="block text-gray-700 dark:text-gray-300 mb-2">Email <span style={{"color": "tomato"}}>*</span></label>
                <input
                  type="email"
                  id="from_email"
                  name="from_email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">Message <span style={{"color": "tomato"}}>*</span></label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white py-3 rounded-lg transition-colors duration-300 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-800 py-8 px-6">
          <div className="container mx-auto text-center">
            <div className="flex justify-center space-x-6 mb-6">
              <a
                href="https://github.com/michelpatrick246"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="mailto:michelpatrick246@gmail.com"
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Mail className="w-6 h-6 mr-3" />
              </a>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              © 2025 Tovonjanahary Michel Patrick. Tous droits réservés.
            </p>
          </div>
        </footer>

        {/* Project Modal */}
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;