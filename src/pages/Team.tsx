import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, Linkedin, Link as LinkIcon } from 'lucide-react';
// Guide/Mentor card data
const guide = {
  name: 'Prof. Sumitra Sureliya',
  role: 'Guide / Mentor',
  designation: 'Professor In-Charge, Sri Balaji University',
  email: '', // Add email if available
  profile: 'https://www.sbup.edu.in/',
  photo: '/team/sumitra.jpeg',
  description:
    'Guided and supervised the project throughout development, providing academic direction, domain expertise, and continuous support.',
};
import { Button } from '@/components/ui/button';

// Team member data structure - You will update these with actual information
const teamMembers = [
  {
    id: 1,
    name: 'Prathviraj Chavan',
    role: 'Model Development & Frontend Development',
    initials: 'PC',
    email: 'mr.prathvirajchavan@gmail.com',
    linkedin: 'https://www.linkedin.com/in/prathvirajchavan/',
    photo: '/team/prathviraj-chavan.jpg',
  },
  {
    id: 2,
    name: 'Pooja Choudhary',
    role: 'Model Development & Frontend Development',
    initials: 'PC',
    email: 'poojachoudhary1178@gmail.com',
    linkedin: 'https://www.linkedin.com/in/pooja-choudhary1178/',
    photo: '/team/pooja-choudhary.png',
  },
  {
    id: 3,
    name: 'Shubhi Upadhyay',
    role: 'Data Collection & Preprocessing',
    initials: 'SU',
    email: 'shubhiupadhyay1516@gmail.com',
    linkedin: 'https://www.linkedin.com/in/shubhii1516/',
    photo: '/team/shubhi.jpeg',
  },
  {
    id: 4,
    name: 'Saniya Devarshi',
    role: 'Data Collection & Preprocessing',
    initials: 'SD',
    email: 'saniyadevarshi004@gmail.com',
    linkedin: 'https://www.linkedin.com/in/saniya-devarshi0404/',
    photo: '/team/saniya devarshi.jpg',
  },
];

export default function Team() {
  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-muted/30 via-background to-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Project Team
            </span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            This is an academic Deep Learning project built by a dedicated team of four members, 
            combining expertise in machine learning, data science, and software development to preserve 
            and promote the art of Bharatanatyam through technology.
          </p>
        </motion.div>

        {/* Project Guide Row */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#D6336C' }}>Project Guide</h2>
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="w-full max-w-xs"
            >
              <Card className="h-full text-center overflow-hidden hover:shadow-xl transition-shadow duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  {/* Avatar Circle with Photo */}
                  <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#D6336C] via-secondary to-accent flex items-center justify-center shadow-lg overflow-hidden">
                    <img
                      src={guide.photo}
                      alt={guide.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Guide Info */}
                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: '#D6336C' }}>{guide.name}</h3>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#D6336C' }}>{guide.role}</p>
                    <p className="text-xs text-muted-foreground mb-2">{guide.designation}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{guide.description}</p>
                  {/* Contact Buttons */}
                  <div className="flex items-center justify-center gap-3 mt-2">
                    {guide.email && (
                      <a href={`mailto:${guide.email}`} aria-label={`Email ${guide.name}`}>
                        <Button variant="outline" className="flex items-center gap-2 px-3 py-1 text-sm">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </Button>
                      </a>
                    )}
                    {guide.profile && (
                      <a href={guide.profile} target="_blank" rel="noreferrer" aria-label={`${guide.name} University Profile`}>
                        <Button variant="outline" className="flex items-center gap-2 px-3 py-1 text-sm">
                          <LinkIcon className="h-4 w-4" />
                          <span>University Profile</span>
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full text-center overflow-hidden hover:shadow-xl transition-shadow duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  {/* Avatar Circle with Photo */}
                  <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg overflow-hidden">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-card flex items-center justify-center">
                        <User className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  {/* Member Info */}
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-primary mb-2">
                      {member.role}
                    </p>
                  </div>
                  {/* Contact Buttons */}
                  <div className="flex items-center justify-center gap-3 mt-2">
                    {member.email && (
                      <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                        <Button variant="outline" className="flex items-center gap-2 px-3 py-1 text-sm">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </Button>
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label={`${member.name} on LinkedIn`}>
                        <Button variant="outline" className="flex items-center gap-2 px-3 py-1 text-sm">
                          <Linkedin className="h-4 w-4" />
                          <span>LinkedIn</span>
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Project Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-6"
        >
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About the Project
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The Bharatanatyam Mudra Classifier is an innovative Deep Learning project that combines 
                traditional Indian classical dance knowledge with cutting-edge AI technology. Our team has 
                worked to create a comprehensive system that can recognize and classify hand mudras from 
                Bharatanatyam dance.
              </p>
              <p>
                This project serves multiple purposes: preserving cultural heritage through digital means, 
                making classical dance more accessible to learners worldwide, and demonstrating the 
                applications of computer vision and deep learning in the arts.
              </p>
              <p className="italic text-sm">
                
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Technologies Used
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Backend & AI</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• PyTorch for Deep Learning models</li>
                  <li>• Computer Vision techniques</li>
                  <li>• Image preprocessing & augmentation</li>
                  <li>• Model training & optimization</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Frontend</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• React + TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Framer Motion for animations</li>
                  <li>• Responsive design principles</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
