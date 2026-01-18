# Troubleshooting Guide

## Syntax Error: Unexpected end of input

### Symptoms
```
SyntaxError: Unexpected end of input
    at internalCompileFunction (node:internal/vm:76:18)
```

### Possible Causes & Solutions

#### 1. File Upload Corruption
The file may have been corrupted during upload to the server.

**Solution:**
```bash
# Re-upload index.js to the server
# Or if using git:
cd /home/username/node_apps/plutocalcdesigner-mcp
git pull
```

#### 2. Line Ending Issues (CRLF vs LF)
Windows-style line endings (CRLF) can cause issues on Linux servers.

**Solution:**
```bash
# Convert to Unix line endings
dos2unix index.js

# Or manually:
sed -i 's/\r$//' index.js
```

#### 3. Incomplete File Transfer
File may not have been fully transferred.

**Solution:**
```bash
# Check file size matches expected
wc -l index.js
# Should be 396 lines

# Verify syntax locally
node --check index.js
```

#### 4. Node.js Version Mismatch
Older Node.js versions may not support modern syntax.

**Solution:**
```bash
# Check Node.js version
node --version
# Should be 18.x or higher

# Update in cPanel if needed
```

### Quick Fix Steps

1. **Verify file integrity:**
   ```bash
   cd /home/username/node_apps/plutocalcdesigner-mcp
   wc -l index.js  # Should be 396 lines
   file index.js   # Should show "ASCII text"
   ```

2. **Check for hidden characters:**
   ```bash
   cat -A index.js | tail -20
   # Look for ^M or other odd characters
   ```

3. **Re-download from repository:**
   ```bash
   # Backup current file
   mv index.js index.js.backup
   
   # Download fresh copy
   wget https://raw.githubusercontent.com/danpeig/plutocalcdesigner-mcp/main/index.js
   # Or use git pull
   ```

4. **Verify dependencies:**
   ```bash
   npm install --production
   node --check index.js
   ```

5. **Test locally first:**
   ```bash
   node index.js
   # Should start without errors
   ```

6. **Restart in cPanel:**
   - Go to cPanel Node.js Manager
   - Click "Restart" on the application

### Still Having Issues?

**Check the error logs:**
```bash
# cPanel error log location (varies by host)
tail -50 ~/logs/error_log
# Or check in cPanel's Error Log viewer
```

**Verify the file contents:**
```bash
# Check last few lines
tail -10 index.js
# Should end with:
# // Export for Passenger
# module.exports = app;
```

**Test syntax check:**
```bash
node -c index.js
# Should output nothing if OK
```

## Common cPanel/Passenger Issues

### Application Won't Start

1. Check Node.js version in cPanel (needs 18+)
2. Verify Application Startup File is set to `index.js`
3. Check Application URL matches BASE_PATH
4. Ensure dependencies are installed

### Port Conflicts

Passenger manages ports automatically. Don't set PORT in environment variables unless using standalone mode.

### Module Not Found Errors

```bash
cd /home/username/node_apps/plutocalcdesigner-mcp
rm -rf node_modules package-lock.json
npm install --production
```

### CORS Errors

Check that the Application URL in cPanel matches the actual URL you're accessing.

## Getting Help

If problems persist:

1. Check file is exactly 396 lines
2. Verify no syntax errors: `node --check index.js`
3. Ensure dependencies installed: `npm install`
4. Check Node.js version: `node --version` (need 18+)
5. Review cPanel error logs
6. Try running locally: `node index.js`

## Contact

For additional support:
- GitHub: https://github.com/danpeig/plutocalcdesigner-mcp
- Email: contact@plutocalc.com
