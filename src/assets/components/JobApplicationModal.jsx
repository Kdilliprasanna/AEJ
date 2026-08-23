import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';

const JobApplicationModal = ({ job, onClose, onApply }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [resumeData, setResumeData] = useState({
    fullName: 'Your Name',
    email: 'your.email@example.com',
    phone: '+91 9876543210',
    location: 'Bangalore, India',
    summary: `Interested in ${job?.title || 'this position'}. Eager to contribute to ${job?.company || 'your organization'}.`,
    experience: [
      { company: 'Previous Company', position: 'Developer', duration: '2021-2023', desc: 'Relevant experience' }
    ],
    skills: job?.requiredSkills || ['JavaScript', 'React', 'Node.js'],
    education: [{ school: 'University', degree: 'B.Tech', year: '2021' }],
    coverLetter: `I am very interested in the ${job?.title} position at ${job?.company}. With my background in software development and passion for innovation, I believe I am a strong candidate for this role.`
  });

  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const pdfRef = React.useRef();

  const downloadResumePDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 10,
      filename: `${resumeData.fullName}_${job?.title}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleApply = () => {
    const applicationData = {
      jobId: job?.id,
      jobTitle: job?.title,
      company: job?.company,
      templateUsed: selectedTemplate,
      resumeData,
      appliedAt: new Date().toISOString(),
      status: 'submitted'
    };
    onApply(applicationData);
  };

  // Resume Preview Components (Same as ResumeLab)
  const ModernTemplate = () => (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#fff',
      color: '#333',
      fontSize: '11px'
    }}>
      <div style={{ borderBottom: '3px solid #007ACC', paddingBottom: '10px', marginBottom: '10px' }}>
        <h1 style={{ margin: '0', fontSize: '20px', color: '#007ACC' }}>{resumeData.fullName}</h1>
        <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
          {resumeData.email} • {resumeData.phone} • {resumeData.location}
        </div>
      </div>

      {resumeData.summary && (
        <div style={{ marginBottom: '10px' }}>
          <h3 style={{ fontSize: '12px', color: '#007ACC', marginBottom: '5px', textTransform: 'uppercase' }}>Professional Summary</h3>
          <p style={{ margin: '0', lineHeight: '1.4', fontSize: '10px' }}>{resumeData.summary}</p>
        </div>
      )}

      <div style={{ marginBottom: '10px' }}>
        <h3 style={{ fontSize: '12px', color: '#007ACC', marginBottom: '5px', textTransform: 'uppercase' }}>Skills Relevant to {job?.title}</h3>
        <p style={{ margin: '0', fontSize: '10px' }}>{resumeData.skills.join(' • ')}</p>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <h3 style={{ fontSize: '12px', color: '#007ACC', marginBottom: '5px', textTransform: 'uppercase' }}>Experience</h3>
        {resumeData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '5px', fontSize: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>{exp.position} at {exp.company} ({exp.duration})</div>
            <p style={{ margin: '2px 0', fontSize: '9px' }}>• {exp.desc}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 style={{ fontSize: '12px', color: '#007ACC', marginBottom: '5px', textTransform: 'uppercase' }}>Education</h3>
        {resumeData.education.map((edu, idx) => (
          <div key={idx} style={{ fontSize: '10px', marginBottom: '3px' }}>
            <div style={{ fontWeight: 'bold' }}>{edu.degree} • {edu.year}</div>
            <div style={{ fontSize: '9px', color: '#666' }}>{edu.school}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const MinimalTemplate = () => (
    <div style={{
      fontFamily: 'Georgia, serif',
      padding: '20px',
      backgroundColor: '#fff',
      color: '#222',
      fontSize: '11px'
    }}>
      <h1 style={{ fontSize: '18px', margin: '0', fontWeight: 'bold' }}>{resumeData.fullName}</h1>
      <div style={{ fontSize: '9px', marginTop: '3px', borderTop: '1px solid #222', paddingTop: '3px' }}>
        {resumeData.email} | {resumeData.phone} | {resumeData.location}
      </div>

      {resumeData.summary && (
        <div style={{ marginTop: '10px', fontSize: '10px', lineHeight: '1.5' }}>
          {resumeData.summary}
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', textDecoration: 'underline' }}>SKILLS FOR {job?.title?.toUpperCase()}</div>
        <div style={{ fontSize: '10px', marginTop: '4px' }}>{resumeData.skills.join(', ')}</div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', textDecoration: 'underline' }}>EXPERIENCE</div>
        {resumeData.experience.map((exp, idx) => (
          <div key={idx} style={{ fontSize: '10px', marginTop: '4px' }}>
            <div style={{ fontWeight: 'bold' }}>{exp.position}, {exp.company} ({exp.duration})</div>
            <div style={{ marginLeft: '15px', fontSize: '9px' }}>• {exp.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const CreativeTemplate = () => (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex',
      backgroundColor: '#fff'
    }}>
      <div style={{ width: '40%', backgroundColor: '#2C3E50', color: '#fff', padding: '20px', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '16px', marginTop: '0', marginBottom: '15px' }}>{resumeData.fullName}</h2>

        <div style={{ fontSize: '10px', lineHeight: '1.6', marginBottom: '15px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>CONTACT</div>
          <div>{resumeData.email}</div>
          <div>{resumeData.phone}</div>
        </div>

        <div style={{ fontSize: '10px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>SKILLS FOR {job?.company}</div>
          {resumeData.skills.map((skill, idx) => (
            <div key={idx} style={{ marginBottom: '5px', padding: '4px 8px', backgroundColor: '#34495E', borderRadius: '3px', fontSize: '9px' }}>
              {skill}
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: '60%', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '10px', fontSize: '10px', lineHeight: '1.4', color: '#555' }}>
          {resumeData.summary}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '2px solid #2C3E50', paddingBottom: '5px', margin: '0 0 8px 0', color: '#2C3E50' }}>
            RELEVANT EXPERIENCE
          </h3>
          {resumeData.experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '8px', fontSize: '9px' }}>
              <div style={{ fontWeight: 'bold', color: '#2C3E50' }}>{exp.position} at {exp.company}</div>
              <div style={{ fontSize: '8px', color: '#888' }}>{exp.duration}</div>
              <div style={{ fontSize: '9px', marginTop: '2px' }}>• {exp.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ATSTemplate = () => (
    <div style={{
      fontFamily: 'Calibri, Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#fff',
      color: '#000',
      lineHeight: '1.15',
      fontSize: '11px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{resumeData.fullName}</div>
        <div style={{ fontSize: '9px' }}>{resumeData.email} | {resumeData.phone} | {resumeData.location}</div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>PROFESSIONAL SUMMARY</div>
        <div style={{ fontSize: '10px' }}>{resumeData.summary}</div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>SKILLS FOR {job?.title?.toUpperCase()}</div>
        <div style={{ fontSize: '10px' }}>{resumeData.skills.join(', ')}</div>
      </div>

      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>PROFESSIONAL EXPERIENCE</div>
        {resumeData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '5px', fontSize: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>{exp.position}, {exp.company} ({exp.duration})</div>
            <div style={{ marginLeft: '15px' }}>• {exp.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProfessionalTemplate = () => (
    <div style={{
      fontFamily: 'Helvetica, Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#fff',
      color: '#1a1a1a',
      fontSize: '10px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #000' }}>
        <h1 style={{ fontSize: '16px', margin: '0 0 5px 0', letterSpacing: '1px' }}>{resumeData.fullName}</h1>
        <div style={{ fontSize: '9px', letterSpacing: '0.5px' }}>
          {resumeData.email} | {resumeData.phone} | {resumeData.location}
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Application for: {job?.title} at {job?.company}</div>
        <div style={{ fontSize: '10px', lineHeight: '1.4' }}>{resumeData.summary}</div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Relevant Skills</div>
        <div>{resumeData.skills.join(' • ')}</div>
      </div>

      <div>
        <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Experience</div>
        {resumeData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '5px' }}>
            <div style={{ fontWeight: 'bold' }}>{exp.position} at {exp.company} ({exp.duration})</div>
            <div style={{ fontSize: '9px' }}>• {exp.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const templates = {
    modern: <ModernTemplate />,
    minimal: <MinimalTemplate />,
    creative: <CreativeTemplate />,
    ats: <ATSTemplate />,
    professional: <ProfessionalTemplate />
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        maxWidth: '1200px',
        width: '95%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Apply for {job?.title} at {job?.company}</h2>
          <button onClick={onClose} style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px' }}>
          {/* Left Panel */}
          <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
            <h4>Select Template</h4>
            {['modern', 'minimal', 'creative', 'ats', 'professional'].map(template => (
              <button
                key={template}
                onClick={() => setSelectedTemplate(template)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  border: selectedTemplate === template ? '2px solid #007ACC' : '1px solid #ddd',
                  backgroundColor: selectedTemplate === template ? '#E8F4F8' : '#fff',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontWeight: selectedTemplate === template ? 'bold' : 'normal',
                  textTransform: 'capitalize'
                }}
              >
                {template}
              </button>
            ))}

            <hr />

            <h4>Job Details</h4>
            <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
              <div><strong>Position:</strong> {job?.title}</div>
              <div><strong>Company:</strong> {job?.company}</div>
              <div><strong>Salary:</strong> {job?.salary}</div>
              <div><strong>Match:</strong> {job?.match}%</div>
            </div>

            <hr />

            <button
              onClick={downloadResumePDF}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#ffc107',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}
            >
              📥 Download Resume
            </button>

            <button
              onClick={handleApply}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}
            >
              ✓ Submit Application
            </button>

            <button
              onClick={() => setShowCoverLetter(!showCoverLetter)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📄 {showCoverLetter ? 'Hide' : 'Show'} Cover Letter
            </button>
          </div>

          {/* Right Panel - Preview */}
          <div>
            <div ref={pdfRef} style={{ border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fff', minHeight: '600px' }}>
              {templates[selectedTemplate]}
            </div>

            {showCoverLetter && (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h4>Cover Letter</h4>
                <textarea
                  value={resumeData.coverLetter}
                  onChange={(e) => setResumeData({ ...resumeData, coverLetter: e.target.value })}
                  style={{
                    width: '100%',
                    height: '150px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;
