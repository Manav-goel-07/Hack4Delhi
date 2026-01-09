import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import VerificationResultCard from './VerificationResultCard';
import { verifyClaim } from "../../../services/verifyClaim";
import {useRef } from 'react';



const ClaimSubmissionForm = () => {
  const [claimText, setClaimText] = useState('');
  const [claimUrl, setClaimUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!claimText?.trim() && !claimUrl?.trim()) {
      newErrors.general = 'Please provide either claim text or a URL';
    }
    if (claimUrl && !claimUrl.match(/^https?:\/\/.+/)) {
      newErrors.url = 'Please enter a valid URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await verifyClaim(claimText);

      // Map AI output → VerificationResultCard contract
      setResult({
        status: data?.risk === '✅ Informational'
          ? 'verified'
          : 'needs-context',
        claim: claimText,
        summary: data?.reply || 'No explanation available.',
        sources: [
          {
            title: 'Election Commission of India',
            url: 'https://eci.gov.in'
          },
          {
            title: 'Constitution of India',
            url: 'https://legislative.gov.in/constitution-of-india'
          }
        ]
      });

      setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
        });
      }, 10);

    } catch (err) {
      setResult({
        status: 'needs-context',
        claim: claimText,
        summary:
          'We were unable to verify this claim at the moment. Please try again later.',
        sources: []
      });
    }

    setLoading(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Search" size={20} color="var(--color-primary)" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          Submit Claim for Verification
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Claim Text"
          type="text"
          placeholder="Enter the claim you want to verify (e.g., 'ONOE will reduce election costs by 50%')"
          value={claimText}
          onChange={(e) => setClaimText(e.target.value)}
          description="Paste the exact claim as you saw it"
        />

        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-sm text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        <Input
          label="Source URL"
          type="url"
          placeholder="https://example.com/article"
          value={claimUrl}
          onChange={(e) => setClaimUrl(e.target.value)}
          error={errors.url}
          description="Provide the URL where you found this claim"
        />

        {errors.general && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <Icon name="AlertCircle" size={18} color="var(--color-destructive)" />
            <p className="text-sm text-destructive">{errors.general}</p>
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          iconName="CheckCircle"
          iconPosition="left"
        >
          Verify Claim
        </Button>
      </form>

      {loading && (
        <p className="mt-4 text-sm text-muted-foreground">
          Verifying claim…
        </p>
      )}

      {result && (
       <div ref={resultRef} className="mt-8">
       <VerificationResultCard
        result={result}
        onShare={() => {}}
        onExplore={() => {}}
    />
  </div>
)}


      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} color="var(--color-primary)" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">
              How it works:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>AI analyzes the claim in a neutral manner</li>
              <li>Responses are contextual, not opinionated</li>
              <li>Sources are provided for independent verification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimSubmissionForm;
