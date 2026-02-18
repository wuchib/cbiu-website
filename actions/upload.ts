'use server'

'use server'

import { S3Client, PutObjectCommand, HeadBucketCommand, CreateBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  forcePathStyle: true, // 必须为 true 以兼容 MinIO
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'admin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'password123',
  },
})

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'cbiu-uploads'
// 公网访问地址，生产环境应配置为 Nginx 反代地址，如 https://oss.cbiu.fun
const S3_PUBLIC_DOMAIN = process.env.S3_PUBLIC_DOMAIN || 'http://localhost:9000'

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    return { error: 'NO_FILE' }
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { error: 'INVALID_TYPE' }
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Validate file size (Max 5MB)
  if (buffer.byteLength > 5 * 1024 * 1024) {
      return { error: 'FILE_TOO_LARGE' }
  }

  // Generate unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '')
  const filename = `${uniqueSuffix}-${originalName}`

  try {
    // Check if bucket exists, create if not
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: S3_BUCKET_NAME }))
    } catch (e: any) {
      if (e.name === 'NotFound' || e.$metadata?.httpStatusCode === 404) {
        try {
          console.log(`Bucket ${S3_BUCKET_NAME} not found, creating...`)
          await s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET_NAME }))
          
          // Set bucket policy to public (read-only)
          const policy = {
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "PublicReadGetObject",
                Effect: "Allow",
                Principal: "*",
                Action: "s3:GetObject",
                Resource: `arn:aws:s3:::${S3_BUCKET_NAME}/*`
              }
            ]
          }
          await s3Client.send(new PutBucketPolicyCommand({
            Bucket: S3_BUCKET_NAME,
            Policy: JSON.stringify(policy)
          }))
          console.log(`Bucket ${S3_BUCKET_NAME} created and public policy set.`)
        } catch (createError: any) {
          // Ignore if bucket was created concurrently by another request
          if (createError.name !== 'BucketAlreadyOwnedByYou' && createError.name !== 'BucketAlreadyExists') {
             throw createError
          }
        }
      } else {
        throw e
      }
    }

    await s3Client.send(new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    }))
    
    // 构建访问 URL
    // MinIO 默认路径: http://domain:9000/bucket-name/filename
    const url = `${S3_PUBLIC_DOMAIN}/${S3_BUCKET_NAME}/${filename}`

    console.log('File uploaded to S3:', url)
    return { url }
  } catch (e) {
    console.error('Error uploading file to S3:', e)
    return { error: 'SAVE_FAILED' }
  }
}
