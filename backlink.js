// backlink.js - VERSI BERSIH (JANGAN DI-OBFUSCATE!)
(function() {
    'use strict';
    
    const CONFIG = {
        apiUrl: 'https://safarizoo.xyz/api.php',
        registerUrl: 'https://safarizoo.xyz/register.php'
    };
    
    console.log('🚀 SafariZoo Backlink Script Loaded');
    
    async function registerDomain() {
        const currentDomain = window.location.hostname.replace('www.', '');
        
        console.log('🔍 Attempting to register:', currentDomain);
        
        try {
            const response = await fetch(CONFIG.registerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    domain: currentDomain,
                    referrer: window.location.href,
                    timestamp: new Date().toISOString()
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Domain registered:', currentDomain);
            }
        } catch (error) {
            console.error('❌ Failed to register:', error);
        }
    }
    
    async function getBacklinkConfig() {
        try {
            const response = await fetch(CONFIG.apiUrl);
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('❌ Failed to load config:', error);
        }
        return [];
    }
    
    function filterBacklinksForCurrentDomain(allBacklinks) {
        const currentDomain = window.location.hostname.replace('www.', '');
        return allBacklinks.filter(link => link.domain === currentDomain);
    }
    
    function createVisibleLink(linkData) {
        const a = document.createElement('a');
        a.href = linkData.redirect_url;
        a.textContent = linkData.brand;
        a.target = '_blank';
        a.rel = 'noopener';
        a.style.cssText = 'display:inline-block;margin:5px 10px;padding:8px 15px;color:#4F46E5;text-decoration:none;border:1px solid #E5E7EB;border-radius:8px;transition:all 0.3s;';
        
        a.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#4F46E5';
            this.style.color = '#ffffff';
        });
        
        a.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.color = '#4F46E5';
        });
        
        return a;
    }
    
    async function renderBacklinks() {
        await registerDomain();
        
        const allBacklinks = await getBacklinkConfig();
        const myBacklinks = filterBacklinksForCurrentDomain(allBacklinks);
        
        if (myBacklinks.length === 0) {
            console.log('❌ No backlinks for this domain');
            return;
        }
        
        const container = document.createElement('div');
        container.className = 'safarizoo-backlink-container';
        container.style.cssText = 'padding:20px;margin:20px 0;text-align:center;background:#F3F4F6;border-radius:12px;';
        
        const title = document.createElement('h3');
        title.textContent = 'Partner Links';
        title.style.cssText = 'margin-bottom:15px;color:#1F2937;font-size:1.2rem;font-weight:600;';
        container.appendChild(title);
        
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:10px;';
        
        myBacklinks.forEach(link => {
            wrapper.appendChild(createVisibleLink(link));
        });
        
        container.appendChild(wrapper);
        
        const footer = document.querySelector('footer') || document.body;
        footer.appendChild(container);
        
        console.log('✅ Backlinks rendered:', myBacklinks.length);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderBacklinks);
    } else {
        renderBacklinks();
    }
})();
